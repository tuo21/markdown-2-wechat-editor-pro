<script setup lang="ts">
/**
 * Preview.vue - 微信预览组件
 * 
 * 模拟微信公众号文章的显示效果：
 * 1. 将 Markdown 渲染为 HTML
 * 2. 应用主题样式
 * 3. 模拟 375px 宽度的手机屏幕
 * 4. 暴露预览内容引用供复制功能使用
 */

import { computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useMarkdown } from '../composables/useMarkdown';
import type { Theme } from '../types';
import { ensureCSSString } from '../utils/styleConverter';

// ==================== 组件接口定义 ====================

interface Props {
  content: string;  // Markdown 内容
  theme: Theme;     // 当前主题
}

const props = defineProps<Props>();

// ==================== 组合式函数 ====================

const { renderMarkdown } = useMarkdown();

// ==================== 状态 ====================

/**
 * 预览内容容器的引用
 * 通过 defineExpose 暴露给父组件，用于复制功能
 */
const previewContentRef = ref<HTMLDivElement | null>(null);

/**
 * 动态样式元素的引用
 * 用于注入主题样式
 */
const styleElementRef = ref<HTMLStyleElement | null>(null);

// 暴露给父组件
defineExpose({
  previewContentRef,
});

// ==================== 计算属性 ====================

/**
 * 渲染后的 HTML 内容
 */
const renderedHTML = computed(() => {
  return renderMarkdown(props.content);
});

/**
 * 主题样式 CSS 字符串
 * 根据当前主题动态生成样式规则
 */
const themeStyles = computed(() => {
  const t = props.theme;
  return `
    .preview-content {
      font-size: ${t.styles.global.fontSize};
      line-height: ${t.styles.global.lineHeight};
      color: ${t.styles.global.color};
      background-color: ${t.styles.global.backgroundColor};
      font-family: ${t.styles.global.fontFamily};
    }
    .preview-content h1 { ${ensureCSSString(t.styles.h1)} }
    .preview-content h2 { ${ensureCSSString(t.styles.h2)} }
    .preview-content h3 { ${ensureCSSString(t.styles.h3)} }
    .preview-content p { ${ensureCSSString(t.styles.p)} }
    .preview-content blockquote { ${ensureCSSString(t.styles.quote)} }
    .preview-content code { ${ensureCSSString(t.styles.code)} }
    .preview-content pre { ${ensureCSSString(t.styles.pre)} }
    .preview-content ul { ${ensureCSSString(t.styles.ul)} }
    .preview-content ol { ${ensureCSSString(t.styles.ol)} }
    .preview-content li { ${ensureCSSString(t.styles.li)} }
    .preview-content a { ${ensureCSSString(t.styles.a)} }
    .preview-content img { ${ensureCSSString(t.styles.img)} }
    .preview-content hr { ${ensureCSSString(t.styles.hr)} }
    .preview-content table { ${ensureCSSString(t.styles.table)} }
    .preview-content th { ${ensureCSSString(t.styles.th)} }
    .preview-content td { ${ensureCSSString(t.styles.td)} }
  `;
});

// ==================== 方法 ====================

/**
 * 更新样式元素的内容
 */
const updateStyles = () => {
  if (styleElementRef.value) {
    styleElementRef.value.textContent = themeStyles.value;
  }
};

// ==================== 生命周期 ====================

/**
 * 组件挂载时创建并注入样式元素
 */
onMounted(() => {
  if (typeof document !== 'undefined') {
    const styleEl = document.createElement('style');
    styleEl.id = 'preview-theme-styles';
    document.head.appendChild(styleEl);
    styleElementRef.value = styleEl;
    updateStyles();
  }
});

/**
 * 组件卸载时清理样式元素
 * 防止内存泄漏
 */
onUnmounted(() => {
  if (styleElementRef.value) {
    styleElementRef.value.remove();
    styleElementRef.value = null;
  }
});

/**
 * 监听主题变化，更新样式
 */
watch(() => props.theme, () => {
  nextTick(() => {
    updateStyles();
  });
}, { deep: true });
</script>

<template>
  <!-- 预览容器：灰色背景，垂直布局 -->
  <div class="flex flex-col h-full bg-gray-100 dark:bg-gray-800">
    <!-- 预览内容区：显示手机模拟器，顶部对齐避免内容截断 -->
    <div class="flex-1 flex items-start justify-center p-8 overflow-auto">
      <div class="relative">
        <!-- 手机外框装饰（阴影效果） -->
        <div class="absolute -top-3 -bottom-3 -left-3 -right-3 bg-gray-300 dark:bg-gray-700 rounded-2xl shadow-xl"></div>
        
        <!-- 模拟手机屏幕（375px 宽度，模拟 iPhone 尺寸） -->
        <div
          class="relative w-[375px] bg-white rounded-xl shadow-2xl overflow-hidden"
          style="min-height: 600px;"
        >
          <!-- 预览内容（应用主题样式） -->
          <div class="p-4">
            <div
              ref="previewContentRef"
              class="preview-content"
              v-html="renderedHTML"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
