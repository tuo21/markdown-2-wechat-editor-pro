<script setup lang="ts">
/**
 * ThemeEditor.vue - 主题编辑器组件
 * 
 * 这是一个全屏侧边栏式的主题编辑器，提供：
 * 1. 左侧样式编辑面板（380px 宽度）
 * 2. 右侧实时预览区域
 * 3. 支持全局样式、标题、内容块、其他元素四大类
 * 4. 每个元素可独立展开/折叠编辑
 */

import { ref, computed, watch } from 'vue';
import type { Theme, StyleProperties, GlobalStyle } from '../types';
import { parseCSSString, toCSSString, ensureStyleProperties } from '../utils/styleConverter';
import Preview from './Preview.vue';

// ==================== 组件接口定义 ====================

interface Props {
  theme: Theme;      // 要编辑的主题
  content: string;   // 用于预览的 Markdown 内容
}

interface Emits {
  (e: 'close'): void;              // 关闭编辑器
  (e: 'save', theme: Theme): void; // 保存主题
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// ==================== 状态管理 ====================

/**
 * 当前激活的分类标签
 * - global: 全局样式
 * - headings: 标题样式（H1, H2, H3）
 * - blocks: 内容块样式（段落、引用、代码等）
 * - others: 其他样式（链接、图片、表格等）
 */
const activeCategory = ref<'global' | 'headings' | 'blocks' | 'others'>('global');

/**
 * 已展开的元素项
 * 用于控制折叠面板的展开/收起状态
 */
const expandedItems = ref<Set<string>>(new Set(['h1', 'h2', 'h3', 'p']));

/**
 * 正在编辑的主题副本
 * 使用深拷贝避免直接修改原始主题
 */
const editingTheme = ref<Theme>(JSON.parse(JSON.stringify(props.theme)));

// ==================== 计算属性 ====================

/**
 * 可编辑的样式对象
 * 将主题中的 CSS 字符串转换为对象形式，便于编辑
 */
const editableStyles = computed(() => {
  const result: Record<string, StyleProperties> = {};
  const keys = ['h1', 'h2', 'h3', 'p', 'quote', 'code', 'pre', 'ul', 'ol', 'li', 'a', 'img', 'hr', 'table', 'th', 'td'] as const;
  
  keys.forEach(key => {
    result[key] = ensureStyleProperties(editingTheme.value.styles[key]);
  });
  
  return result;
});

/**
 * 全局样式的计算属性
 * 提供便捷的 getter/setter
 */
const globalStyle = computed({
  get: () => editingTheme.value.styles.global,
  set: (val: GlobalStyle) => {
    editingTheme.value.styles.global = val;
  }
});

// ==================== 样式更新方法 ====================

/**
 * 更新特定元素的样式属性
 * @param elementKey 元素键名（如 'h1', 'p', 'quote' 等）
 * @param property CSS 属性名（如 'color', 'fontSize' 等）
 * @param value 属性值
 */
const updateStyle = (elementKey: string, property: string, value: string) => {
  if (!editableStyles.value[elementKey]) {
    editableStyles.value[elementKey] = {};
  }
  (editableStyles.value[elementKey] as Record<string, string>)[property] = value;
  (editingTheme.value.styles as Record<string, unknown>)[elementKey] = { ...editableStyles.value[elementKey] };
};

/**
 * 更新全局样式属性
 * @param property 全局样式属性名
 * @param value 属性值
 */
const updateGlobalStyle = (property: keyof GlobalStyle, value: string) => {
  globalStyle.value[property] = value;
};

/**
 * 重置元素样式到原始值
 * @param elementKey 要重置的元素键名
 */
const resetStyle = (elementKey: string) => {
  if (props.theme.styles[elementKey as keyof typeof props.theme.styles]) {
    (editingTheme.value.styles as Record<string, unknown>)[elementKey] = 
      JSON.parse(JSON.stringify(props.theme.styles[elementKey as keyof typeof props.theme.styles]));
  }
};

/**
 * 切换元素面板的展开/折叠状态
 * @param key 元素键名
 */
const toggleExpand = (key: string) => {
  if (expandedItems.value.has(key)) {
    expandedItems.value.delete(key);
  } else {
    expandedItems.value.add(key);
  }
};

// ==================== 保存和关闭 ====================

/**
 * 保存主题
 * 将样式对象转换回 CSS 字符串格式后发送保存事件
 */
const saveTheme = () => {
  const themeToSave: Theme = {
    ...editingTheme.value,
    styles: {
      ...editingTheme.value.styles,
    }
  };
  
  // 将样式对象转换为 CSS 字符串
  Object.keys(themeToSave.styles).forEach(key => {
    if (key !== 'global') {
      (themeToSave.styles as Record<string, unknown>)[key] = toCSSString(ensureStyleProperties((themeToSave.styles as Record<string, unknown>)[key] as StyleProperties));
    }
  });
  
  emit('save', themeToSave);
};

/**
 * 关闭编辑器（不保存）
 */
const handleClose = () => {
  emit('close');
};

// ==================== 监听器 ====================

/**
 * 监听传入的主题变化，更新编辑副本
 */
watch(() => props.theme, (newTheme) => {
  editingTheme.value = JSON.parse(JSON.stringify(newTheme));
}, { immediate: true });

// ==================== 配置数据 ====================

/**
 * 各分类下的元素项配置
 */
const categoryItems = {
  global: [],
  headings: [
    { key: 'h1', label: 'H1 标题' },
    { key: 'h2', label: 'H2 标题' },
    { key: 'h3', label: 'H3 标题' },
  ],
  blocks: [
    { key: 'p', label: '段落' },
    { key: 'quote', label: '引用' },
    { key: 'code', label: '行内代码' },
    { key: 'pre', label: '代码块' },
    { key: 'ul', label: '无序列表' },
    { key: 'ol', label: '有序列表' },
    { key: 'li', label: '列表项' },
  ],
  others: [
    { key: 'a', label: '链接' },
    { key: 'img', label: '图片' },
    { key: 'hr', label: '分割线' },
    { key: 'table', label: '表格' },
    { key: 'th', label: '表头' },
    { key: 'td', label: '单元格' },
  ],
};

/**
 * 字体大小预设选项
 */
const fontSizeOptions = ['12px', '14px', '15px', '16px', '18px', '20px', '22px', '24px', '26px', '28px', '32px'];

/**
 * 字重预设选项
 */
const fontWeightOptions = ['400', '500', '600', '700', '800', '900'];

/**
 * 行高预设选项
 */
const lineHeightOptions = ['1.5', '1.6', '1.75', '1.8', '2.0'];
</script>

<template>
  <!-- 全屏容器：固定定位，覆盖整个视口，z-index 高于遮罩层，白色背景 -->
  <div class="fixed inset-0 z-[60] flex flex-col bg-white dark:bg-gray-900">
    
    <!-- 顶部标题栏：白色背景，带底部边框和阴影 -->
    <div class="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm flex-shrink-0">
      <!-- 左侧：标题和主题名称输入 -->
      <div class="flex items-center gap-4">
        <h2 class="text-xl font-bold text-gray-800 dark:text-white">主题编辑器</h2>
        <!-- 主题名称输入框 -->
        <input
          v-model="editingTheme.name"
          type="text"
          class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="主题名称"
        />
      </div>
      <!-- 右侧：操作按钮 -->
      <div class="flex items-center gap-3">
        <button
          @click="handleClose"
          class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          取消
        </button>
        <button
          @click="saveTheme"
          class="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
        >
          保存主题
        </button>
      </div>
    </div>

    <!-- 主内容区：左右分栏 -->
    <div class="flex-1 flex overflow-hidden">
      
      <!-- ==================== 左侧：样式编辑面板 ==================== -->
      <div class="w-[400px] flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        
        <!-- 分类标签栏 -->
        <div class="flex border-b border-gray-200 dark:border-gray-700">
          <button
            v-for="cat in [
              { id: 'global', label: '全局' },
              { id: 'headings', label: '标题' },
              { id: 'blocks', label: '内容块' },
              { id: 'others', label: '其他' }
            ]"
            :key="cat.id"
            @click="activeCategory = cat.id as typeof activeCategory"
            :class="[
              'flex-1 px-3 py-3 text-sm font-medium transition-colors',
              activeCategory === cat.id
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            ]"
          >
            {{ cat.label }}
          </button>
        </div>

        <!-- 样式编辑区域（可滚动） -->
        <div class="flex-1 overflow-y-auto p-4 space-y-4">
          
          <!-- ===== 全局样式编辑 ===== -->
          <div v-if="activeCategory === 'global'" class="space-y-4">
            <!-- 字体大小 -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">字体大小</label>
              <div class="flex gap-2">
                <select
                  :value="globalStyle.fontSize"
                  @change="(e) => updateGlobalStyle('fontSize', (e.target as HTMLSelectElement).value)"
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
                >
                  <option v-for="size in fontSizeOptions" :key="size" :value="size">{{ size }}</option>
                </select>
                <input
                  type="text"
                  :value="globalStyle.fontSize"
                  @input="(e) => updateGlobalStyle('fontSize', (e.target as HTMLInputElement).value)"
                  class="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
                />
              </div>
            </div>

            <!-- 行高 -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">行高</label>
              <div class="flex gap-2">
                <select
                  :value="globalStyle.lineHeight"
                  @change="(e) => updateGlobalStyle('lineHeight', (e.target as HTMLSelectElement).value)"
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
                >
                  <option v-for="lh in lineHeightOptions" :key="lh" :value="lh">{{ lh }}</option>
                </select>
                <input
                  type="text"
                  :value="globalStyle.lineHeight"
                  @input="(e) => updateGlobalStyle('lineHeight', (e.target as HTMLInputElement).value)"
                  class="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
                />
              </div>
            </div>

            <!-- 文字颜色 -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">文字颜色</label>
              <div class="flex items-center gap-2">
                <input
                  type="color"
                  :value="globalStyle.color"
                  @input="(e) => updateGlobalStyle('color', (e.target as HTMLInputElement).value)"
                  class="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <input
                  type="text"
                  :value="globalStyle.color"
                  @input="(e) => updateGlobalStyle('color', (e.target as HTMLInputElement).value)"
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
                />
              </div>
            </div>

            <!-- 背景颜色 -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">背景颜色</label>
              <div class="flex items-center gap-2">
                <input
                  type="color"
                  :value="globalStyle.backgroundColor"
                  @input="(e) => updateGlobalStyle('backgroundColor', (e.target as HTMLInputElement).value)"
                  class="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <input
                  type="text"
                  :value="globalStyle.backgroundColor"
                  @input="(e) => updateGlobalStyle('backgroundColor', (e.target as HTMLInputElement).value)"
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
                />
              </div>
            </div>

            <!-- 字体 -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">字体</label>
              <input
                type="text"
                :value="globalStyle.fontFamily"
                @input="(e) => updateGlobalStyle('fontFamily', (e.target as HTMLInputElement).value)"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
              />
            </div>
          </div>

          <!-- ===== 元素样式编辑（标题、内容块、其他） ===== -->
          <div v-else class="space-y-2">
            <div
              v-for="item in categoryItems[activeCategory]"
              :key="item.key"
              class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              <!-- 可折叠的标题栏 -->
              <button
                @click="toggleExpand(item.key)"
                class="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ item.label }}</span>
                <!-- 展开箭头图标 -->
                <svg
                  :class="['w-4 h-4 text-gray-500 transition-transform', expandedItems.has(item.key) ? 'rotate-180' : '']"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <!-- 展开后的编辑表单 -->
              <div v-if="expandedItems.has(item.key)" class="p-4 space-y-3 bg-white dark:bg-gray-800">
                <!-- 重置按钮 -->
                <div class="flex justify-end">
                  <button
                    @click="resetStyle(item.key)"
                    class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    重置
                  </button>
                </div>

                <!-- 样式属性网格 -->
                <div class="grid grid-cols-2 gap-3">
                  <!-- 文字颜色 -->
                  <div class="space-y-1">
                    <label class="text-xs font-medium text-gray-600 dark:text-gray-400">颜色</label>
                    <div class="flex items-center gap-2">
                      <input
                        type="color"
                        :value="editableStyles[item.key]?.color || '#000000'"
                        @input="(e) => updateStyle(item.key, 'color', (e.target as HTMLInputElement).value)"
                        class="w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer flex-shrink-0"
                      />
                      <input
                        type="text"
                        :value="editableStyles[item.key]?.color || ''"
                        @input="(e) => updateStyle(item.key, 'color', (e.target as HTMLInputElement).value)"
                        class="flex-1 min-w-0 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs"
                      />
                    </div>
                  </div>

                  <!-- 背景颜色 -->
                  <div class="space-y-1">
                    <label class="text-xs font-medium text-gray-600 dark:text-gray-400">背景色</label>
                    <div class="flex items-center gap-2">
                      <input
                        type="color"
                        :value="editableStyles[item.key]?.backgroundColor || '#ffffff'"
                        @input="(e) => updateStyle(item.key, 'backgroundColor', (e.target as HTMLInputElement).value)"
                        class="w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer flex-shrink-0"
                      />
                      <input
                        type="text"
                        :value="editableStyles[item.key]?.backgroundColor || ''"
                        @input="(e) => updateStyle(item.key, 'backgroundColor', (e.target as HTMLInputElement).value)"
                        class="flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs"
                      />
                    </div>
                  </div>

                  <!-- 字体大小 -->
                  <div class="space-y-1">
                    <label class="text-xs font-medium text-gray-600 dark:text-gray-400">字体大小</label>
                    <select
                      :value="editableStyles[item.key]?.fontSize || ''"
                      @change="(e) => updateStyle(item.key, 'fontSize', (e.target as HTMLSelectElement).value)"
                      class="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs"
                    >
                      <option value="">默认</option>
                      <option v-for="size in fontSizeOptions" :key="size" :value="size">{{ size }}</option>
                    </select>
                  </div>

                  <!-- 字重 -->
                  <div class="space-y-1">
                    <label class="text-xs font-medium text-gray-600 dark:text-gray-400">字重</label>
                    <select
                      :value="editableStyles[item.key]?.fontWeight || ''"
                      @change="(e) => updateStyle(item.key, 'fontWeight', (e.target as HTMLSelectElement).value)"
                      class="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs"
                    >
                      <option value="">默认</option>
                      <option v-for="fw in fontWeightOptions" :key="fw" :value="fw">{{ fw }}</option>
                    </select>
                  </div>

                  <!-- 外边距 -->
                  <div class="space-y-1">
                    <label class="text-xs font-medium text-gray-600 dark:text-gray-400">外边距</label>
                    <input
                      type="text"
                      :value="editableStyles[item.key]?.margin || ''"
                      @input="(e) => updateStyle(item.key, 'margin', (e.target as HTMLInputElement).value)"
                      class="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs"
                      placeholder="如: 16px 0"
                    />
                  </div>

                  <!-- 内边距 -->
                  <div class="space-y-1">
                    <label class="text-xs font-medium text-gray-600 dark:text-gray-400">内边距</label>
                    <input
                      type="text"
                      :value="editableStyles[item.key]?.padding || ''"
                      @input="(e) => updateStyle(item.key, 'padding', (e.target as HTMLInputElement).value)"
                      class="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs"
                      placeholder="如: 8px 16px"
                    />
                  </div>
                </div>

                <!-- 其他样式（CSS 文本） -->
                <div class="space-y-1">
                  <label class="text-xs font-medium text-gray-600 dark:text-gray-400">其他样式 (CSS)</label>
                  <textarea
                    :value="toCSSString(editableStyles[item.key] || {})"
                    @input="(e) => {
                      const parsed = parseCSSString((e.target as HTMLTextAreaElement).value);
                      Object.keys(parsed).forEach(key => {
                        updateStyle(item.key, key, parsed[key] || '');
                      });
                    }"
                    class="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-mono text-xs"
                    rows="3"
                    placeholder="border-radius: 8px; border-left: 4px solid #000;"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== 右侧：实时预览区域 ==================== -->
      <div class="flex-1 flex flex-col bg-gray-100 dark:bg-gray-800">
        <!-- 预览标题 -->
        <div class="flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">实时预览</span>
        </div>
        
        <!-- 预览内容区 -->
        <div class="flex-1 flex items-center justify-center p-8 overflow-auto">
          <!-- 直接使用 Preview 组件，不添加额外装饰 -->
          <Preview
            :content="content"
            :theme="editingTheme"
          />
        </div>
      </div>
    </div>
  </div>
</template>
