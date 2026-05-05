<script setup lang="ts">
/**
 * App.vue - 应用主组件
 * 
 * 这是整个应用的核心组件，负责：
 * 1. 管理全局状态（Markdown内容、主题、深色模式等）
 * 2. 协调子组件之间的数据流
 * 3. 处理本地存储的读写
 */

import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
// 子组件导入
import Editor from './components/Editor.vue';      // Markdown 编辑器
import Preview from './components/Preview.vue';    // 微信预览组件
import Toolbar from './components/Toolbar.vue';    // 顶部工具栏
import StyleConfig from './components/StyleConfig.vue';  // 主题选择栏
import Toast from './components/Toast.vue';        // 消息提示组件
import ThemeEditor from './components/ThemeEditor.vue';  // 主题编辑器（全屏）

// 组合式函数
import { useStorage } from './composables/useStorage';    // 本地存储封装
import { useClipboard } from './composables/useClipboard'; // 剪贴板操作

// 主题和类型
import { DEFAULT_THEMES } from './styles/themes';  // 默认主题列表
import type { Theme } from './types';
import { isThemeArray } from './types';

// ==================== 存储相关 ====================
const { STORAGE_KEYS, get, set } = useStorage();
const { copyWeChatHTML } = useClipboard();

// ==================== 核心状态 ====================

/**
 * Markdown 内容
 * 从 localStorage 读取，如果没有则使用默认欢迎内容
 */
const contentMarkdown = ref<string>(get(STORAGE_KEYS.CONTENT, '# 欢迎使用 WeChat Editor Pro\n\n这是一款轻量级的微信公众号排版工具。\n\n## 功能特性\n\n- ✨ 支持 Markdown 实时预览\n- 🎨 多种主题样式可选\n- 📋 一键复制为微信兼容格式\n- 💾 自动保存内容\n\n## 使用示例\n\n### 代码块\n\n```javascript\nconsole.log("Hello, WeChat!");\n```\n\n### 引用\n\n> 这是一段引用文字\n\n### 列表\n\n1. 第一项\n2. 第二项\n3. 第三项\n'));

/**
 * 当前选中的主题 ID
 */
const currentThemeId = ref<string>(get(STORAGE_KEYS.CURRENT_THEME_ID, 'default'));

/**
 * 用户自定义主题列表
 * 从 localStorage 读取并验证数据类型
 */
const storedThemes = get<unknown>(STORAGE_KEYS.THEMES, []);
const customThemes = ref<Theme[]>(
  isThemeArray(storedThemes) 
    ? storedThemes.map(theme => ({ ...theme, isCustom: true }))
    : []
);

/**
 * 深色模式状态
 */
const isDark = ref<boolean>(get(STORAGE_KEYS.DARK_MODE, false));

// ==================== Toast 消息提示状态 ====================
const toastShow = ref<boolean>(false);
const toastMessage = ref<string>('');
const toastType = ref<'success' | 'error' | 'info'>('info');

// ==================== 主题编辑器状态 ====================
const isThemeEditorOpen = ref<boolean>(false);  // 编辑器是否打开
const editingTheme = ref<Theme | null>(null);   // 正在编辑的主题

/**
 * 子组件引用
 */
const editorRef = ref<{ editorScrollRef: HTMLTextAreaElement | null } | null>(null);
const previewComponentRef = ref<{ previewContentRef: HTMLDivElement | null; previewScrollContainerRef: HTMLDivElement | null } | null>(null);

// ==================== 同步滚动 ====================

/** 是否正在由代码触发的滚动（防止循环触发） */
let isSyncingFromEditor = false;
let isSyncingFromPreview = false;

/**
 * 根据滚动比例设置目标元素的滚动位置
 */
function setScrollRatio(target: HTMLElement, ratio: number) {
  const maxScroll = target.scrollHeight - target.clientHeight;
  if (maxScroll > 0) {
    target.scrollTop = ratio * maxScroll;
  }
}

/**
 * 获取元素当前的滚动比例 [0, 1]
 */
function getScrollRatio(el: HTMLElement): number {
  const maxScroll = el.scrollHeight - el.clientHeight;
  return maxScroll > 0 ? el.scrollTop / maxScroll : 0;
}

/**
 * 处理编辑器滚动 → 同步预览区
 */
function handleEditorScroll() {
  if (isSyncingFromPreview) return;
  const ta = editorRef.value?.editorScrollRef;
  const container = previewComponentRef.value?.previewScrollContainerRef;
  if (!ta || !container) return;

  isSyncingFromEditor = true;
  const ratio = getScrollRatio(ta);
  setScrollRatio(container, ratio);
  requestAnimationFrame(() => { isSyncingFromEditor = false; });
}

/**
 * 处理预览区滚动 → 同步编辑器
 */
function handlePreviewScroll() {
  if (isSyncingFromEditor) return;
  const ta = editorRef.value?.editorScrollRef;
  const container = previewComponentRef.value?.previewScrollContainerRef;
  if (!ta || !container) return;

  isSyncingFromPreview = true;
  const ratio = getScrollRatio(container);
  setScrollRatio(ta, ratio);
  requestAnimationFrame(() => { isSyncingFromPreview = false; });
}

/**
 * 绑定/解绑同步滚动事件
 */
function bindSyncScroll() {
  nextTick(() => {
    const ta = editorRef.value?.editorScrollRef;
    const container = previewComponentRef.value?.previewScrollContainerRef;
    if (ta) ta.addEventListener('scroll', handleEditorScroll);
    if (container) container.addEventListener('scroll', handlePreviewScroll);
  });
}

function unbindSyncScroll() {
  const ta = editorRef.value?.editorScrollRef;
  const container = previewComponentRef.value?.previewScrollContainerRef;
  if (ta) ta.removeEventListener('scroll', handleEditorScroll);
  if (container) container.removeEventListener('scroll', handlePreviewScroll);
}

// ==================== 计算属性 ====================

/**
 * 所有主题列表 = 默认主题 + 自定义主题
 */
const allThemes = computed(() => [
  ...DEFAULT_THEMES.map(t => ({ ...t, isCustom: false })),
  ...customThemes.value
]);

/**
 * 当前激活的主题对象
 */
const currentTheme = computed((): Theme => {
  const found = allThemes.value.find(t => t.id === currentThemeId.value);
  return (found || allThemes.value[0]) as Theme;
});

// ==================== 方法 ====================

/**
 * 显示 Toast 消息提示
 * @param message 消息内容
 * @param type 消息类型：success | error | info
 */
const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  toastMessage.value = message;
  toastType.value = type;
  toastShow.value = true;
};

/**
 * 处理复制到公众号操作
 * 将预览内容转换为微信兼容格式并复制到剪贴板
 */
const handleCopy = async () => {
  if (!previewComponentRef.value?.previewContentRef) return;
  
  const previewContent = previewComponentRef.value.previewContentRef as HTMLElement;
  if (!previewContent) return;

  const success = await copyWeChatHTML(previewContent);
  
  if (success) {
    showToast('复制成功，请直接粘贴到公众号后台！', 'success');
  } else {
    showToast('复制失败，请重试', 'error');
  }
};

/**
 * 切换深色/亮色模式
 */
const handleToggleDark = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  set(STORAGE_KEYS.DARK_MODE, isDark.value);
};

/**
 * 清空编辑器内容
 */
const handleClear = () => {
  if (confirm('确定要清空所有内容吗？')) {
    contentMarkdown.value = '';
    showToast('内容已清空', 'info');
  }
};

/**
 * 打开主题编辑器
 * @param theme 要编辑的主题
 */
const handleOpenEditor = (theme: Theme) => {
  editingTheme.value = JSON.parse(JSON.stringify(theme));
  isThemeEditorOpen.value = true;
};

/**
 * 关闭主题编辑器
 */
const handleCloseEditor = () => {
  isThemeEditorOpen.value = false;
  editingTheme.value = null;
};

/**
 * 保存主题
 * @param theme 保存的主题数据
 */
const handleSaveTheme = (theme: Theme) => {
  const existingIndex = customThemes.value.findIndex(t => t.id === theme.id);
  if (existingIndex >= 0) {
    // 更新已有主题
    customThemes.value[existingIndex] = theme;
  } else {
    // 添加新主题
    customThemes.value.push(theme);
  }
  currentThemeId.value = theme.id;
  saveCustomThemes();
  showToast('主题保存成功！', 'success');
  handleCloseEditor();
};

/**
 * 删除主题
 * @param themeId 要删除的主题 ID
 */
const handleDeleteTheme = (themeId: string) => {
  customThemes.value = customThemes.value.filter(t => t.id !== themeId);
  if (currentThemeId.value === themeId) {
    currentThemeId.value = 'default';
  }
  saveCustomThemes();
  showToast('主题已删除', 'info');
};

/**
 * 保存自定义主题到 localStorage
 */
const saveCustomThemes = () => {
  set(STORAGE_KEYS.THEMES, customThemes.value);
};

// ==================== 监听器 ====================

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * 监听内容变化，防抖保存到 localStorage
 * 防抖时间：500ms
 */
watch(
  contentMarkdown,
  (newVal) => {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      set(STORAGE_KEYS.CONTENT, newVal);
    }, 500);
  }
);

/**
 * 监听主题 ID 变化，立即保存
 */
watch(currentThemeId, (newVal) => {
  set(STORAGE_KEYS.CURRENT_THEME_ID, newVal);
});

// ==================== 生命周期 ====================

/**
 * 组件挂载时，恢复深色模式状态
 */
onMounted(() => {
  if (isDark.value) {
    document.documentElement.classList.add('dark');
  }
  bindSyncScroll();
});

/**
 * 组件卸载时，清理定时器防止内存泄漏
 */
onUnmounted(() => {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
    saveTimeout = null;
  }
  unbindSyncScroll();
});
</script>

<template>
  <!-- 主容器：全屏高度，垂直布局 -->
  <div class="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 顶部工具栏 -->
    <Toolbar
      :on-copy="handleCopy"
      :on-toggle-dark="handleToggleDark"
      :on-clear="handleClear"
      :is-dark="isDark"
    />
    
    <!-- 主题选择栏 -->
    <StyleConfig
      :themes="allThemes"
      v-model:current-theme-id="currentThemeId"
      @open-editor="handleOpenEditor"
      @delete-theme="handleDeleteTheme"
    />
    
    <!-- 主内容区：左右分栏 -->
    <div class="flex-1 flex overflow-hidden">
      <!-- 左侧：Markdown 编辑器（占 50% 宽度） -->
      <div class="w-1/2 border-r border-gray-200 dark:border-gray-700">
        <Editor ref="editorRef" v-model="contentMarkdown" />
      </div>
      
      <!-- 右侧：微信预览区（占 50% 宽度） -->
      <div class="w-1/2">
        <Preview
          ref="previewComponentRef"
          :content="contentMarkdown"
          :theme="currentTheme"
        />
      </div>
    </div>
    
    <!-- Toast 消息提示 -->
    <Toast
      :show="toastShow"
      :message="toastMessage"
      :type="toastType"
      @close="toastShow = false"
    />

    <!-- 主题编辑器遮罩层：半透明黑色背景，区分主界面 -->
    <div
      v-if="isThemeEditorOpen"
      class="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
      @click="handleCloseEditor"
    />
    
    <!-- 主题编辑器（全屏覆盖层） -->
    <ThemeEditor
      v-if="isThemeEditorOpen && editingTheme"
      :theme="editingTheme"
      :content="contentMarkdown"
      @close="handleCloseEditor"
      @save="handleSaveTheme"
    />
  </div>
</template>
