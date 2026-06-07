<script setup lang="ts">
/**
 * ThemeEditor.vue - 主题编辑器组件
 *
 * 全屏侧边栏式主题编辑器，提供：
 * 1. 左侧样式编辑面板
 * 2. 右侧实时预览区域
 * 3. 每个元素有专属的编辑选项
 */

import { ref, computed, watch } from 'vue';
import type { Theme, StyleProperties, GlobalStyle } from '../types';
import { parseCSSString, toCSSString } from '../utils/styleConverter';
import Preview from './Preview.vue';

// ==================== 组件接口定义 ====================

interface Props {
  theme: Theme;
  content: string;
}

interface Emits {
  (e: 'close'): void;
  (e: 'save', theme: Theme): void;
  (e: 'saveAs', theme: Theme): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// ==================== 状态管理 ====================

const activeCategory = ref<'global' | 'headings' | 'blocks' | 'others'>('global');
const expandedItems = ref<Set<string>>(new Set(['h1', 'h2', 'h3', 'p']));
const isNewTheme = ref<boolean>(props.theme.isCustom === false);
const editingTheme = ref<Theme>(JSON.parse(JSON.stringify(props.theme)));

// ==================== 样式解析 ====================

const STYLE_KEYS = ['h1', 'h2', 'h3', 'p', 'quote', 'code', 'pre', 'ul', 'ol', 'li', 'a', 'img', 'hr', 'table', 'th', 'td', 'strong', 'em', 'del', 'figcaption'] as const;

const editableStyles = ref<Record<string, StyleProperties>>({});

function initEditableStyles(theme: Theme) {
  const next: Record<string, StyleProperties> = {};
  STYLE_KEYS.forEach(key => {
    const raw = theme.styles[key];
    if (typeof raw === 'string') {
      next[key] = parseCSSString(raw);
    } else if (raw && typeof raw === 'object') {
      next[key] = { ...raw };
    } else {
      next[key] = {};
    }
  });
  editableStyles.value = next;
}

initEditableStyles(editingTheme.value);

const globalStyle = computed(() => editingTheme.value.styles.global);

// ==================== 样式更新方法 ====================

const updateStyle = (elementKey: string, property: string, value: string) => {
  if (!editableStyles.value[elementKey]) {
    editableStyles.value[elementKey] = {};
  }
  editableStyles.value[elementKey][property] = value;
  (editingTheme.value.styles as Record<string, unknown>)[elementKey] = { ...editableStyles.value[elementKey] };
};

const updateGlobalStyle = (property: keyof GlobalStyle, value: string) => {
  (editingTheme.value.styles.global as Record<string, unknown>)[property] = value;
};

const resetStyle = (elementKey: string) => {
  const original = props.theme.styles[elementKey as keyof typeof props.theme.styles];
  if (original) {
    (editingTheme.value.styles as Record<string, unknown>)[elementKey] = JSON.parse(JSON.stringify(original));
    editableStyles.value[elementKey] = typeof original === 'string' ? parseCSSString(original) : { ...(original as StyleProperties) };
  }
};

const toggleExpand = (key: string) => {
  if (expandedItems.value.has(key)) {
    expandedItems.value.delete(key);
  } else {
    expandedItems.value.add(key);
  }
};

// ==================== 保存逻辑 ====================

const prepareThemeToSave = (): Theme => {
  const newStyles: Record<string, unknown> = {
    global: { ...editingTheme.value.styles.global },
  };

  Object.keys(editableStyles.value).forEach(key => {
    newStyles[key] = toCSSString(editableStyles.value[key] || {});
  });

  return {
    ...editingTheme.value,
    styles: newStyles as Theme['styles'],
  };
};

const handleSave = () => {
  const themeToSave = prepareThemeToSave();
  emit('save', themeToSave);
};

const handleSaveAs = () => {
  const themeToSave = prepareThemeToSave();
  themeToSave.id = `custom-${Date.now()}`;
  themeToSave.isCustom = true;
  themeToSave.name = `${themeToSave.name} (副本)`;
  isNewTheme.value = true;
  emit('saveAs', themeToSave);
};

const handleClose = () => {
  emit('close');
};

watch(() => props.theme, (newTheme) => {
  editingTheme.value = JSON.parse(JSON.stringify(newTheme));
  initEditableStyles(editingTheme.value);
}, { immediate: true });

// ==================== 选项配置数据 ====================

interface StyleOption {
  key: string;
  label: string;
  type: 'color' | 'text' | 'select' | 'margin' | 'padding';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface ElementConfig {
  key: string;
  label: string;
  options: StyleOption[];
  showCssFallback?: boolean;
}

// 字号选项
const fontSizeOptions = [
  { value: '12px', label: '12px' },
  { value: '14px', label: '14px' },
  { value: '15px', label: '15px' },
  { value: '16px', label: '16px' },
  { value: '17px', label: '17px' },
  { value: '18px', label: '18px' },
  { value: '20px', label: '20px' },
  { value: '21px', label: '21px' },
  { value: '22px', label: '22px' },
  { value: '24px', label: '24px' },
  { value: '26px', label: '26px' },
  { value: '28px', label: '28px' },
  { value: '32px', label: '32px' },
];

// 字重选项
const fontWeightOptions = [
  { value: '400', label: '正常 (400)' },
  { value: '500', label: '中等 (500)' },
  { value: '600', label: '半粗 (600)' },
  { value: '700', label: '粗体 (700)' },
  { value: '800', label: '特粗 (800)' },
  { value: '900', label: '黑体 (900)' },
];

// 文本对齐选项
const textAlignOptions = [
  { value: 'left', label: '左对齐' },
  { value: 'center', label: '居中' },
  { value: 'right', label: '右对齐' },
  { value: 'justify', label: '两端对齐' },
];

// 字体样式选项
const fontStyleOptions = [
  { value: 'normal', label: '正常' },
  { value: 'italic', label: '斜体' },
];

// 文本装饰选项
const textDecorationOptions = [
  { value: 'none', label: '无' },
  { value: 'underline', label: '下划线' },
  { value: 'line-through', label: '删除线' },
];

// 边框样式选项
const borderStyleOptions = [
  { value: 'solid', label: '实线' },
  { value: 'dashed', label: '虚线' },
  { value: 'dotted', label: '点线' },
  { value: 'double', label: '双线' },
];

// 元素配置映射
const ELEMENT_CONFIGS: Record<string, ElementConfig> = {
  h1: {
    key: 'h1',
    label: 'H1 标题',
    options: [
      { key: 'color', label: '颜色', type: 'color', placeholder: '#1a1a1a' },
      { key: 'fontSize', label: '字号', type: 'select', options: fontSizeOptions },
      { key: 'fontWeight', label: '字重', type: 'select', options: fontWeightOptions },
      { key: 'lineHeight', label: '行高', type: 'text', placeholder: '1.2' },
      { key: 'margin', label: '外边距', type: 'margin' },
      { key: 'textAlign', label: '对齐', type: 'select', options: textAlignOptions },
      { key: 'borderBottomWidth', label: '底边宽度', type: 'text', placeholder: '2px' },
      { key: 'borderBottomColor', label: '底边颜色', type: 'color' },
    ],
    showCssFallback: true,
  },
  h2: {
    key: 'h2',
    label: 'H2 标题',
    options: [
      { key: 'color', label: '颜色', type: 'color', placeholder: '#1a1a1a' },
      { key: 'fontSize', label: '字号', type: 'select', options: fontSizeOptions },
      { key: 'fontWeight', label: '字重', type: 'select', options: fontWeightOptions },
      { key: 'lineHeight', label: '行高', type: 'text', placeholder: '1.3' },
      { key: 'margin', label: '外边距', type: 'margin' },
      { key: 'textAlign', label: '对齐', type: 'select', options: textAlignOptions },
      { key: 'borderLeftWidth', label: '左侧宽度', type: 'text', placeholder: '4px' },
      { key: 'borderLeftColor', label: '左侧颜色', type: 'color' },
      { key: 'paddingLeft', label: '左侧内边距', type: 'text', placeholder: '12px' },
    ],
    showCssFallback: true,
  },
  h3: {
    key: 'h3',
    label: 'H3 标题',
    options: [
      { key: 'color', label: '颜色', type: 'color', placeholder: '#1a1a1a' },
      { key: 'fontSize', label: '字号', type: 'select', options: fontSizeOptions },
      { key: 'fontWeight', label: '字重', type: 'select', options: fontWeightOptions },
      { key: 'margin', label: '外边距', type: 'margin' },
      { key: 'borderLeftWidth', label: '左侧竖线宽度', type: 'text', placeholder: '3px' },
      { key: 'borderLeftColor', label: '左侧竖线颜色', type: 'color' },
      { key: 'paddingLeft', label: '左侧内边距', type: 'text', placeholder: '10px' },
    ],
    showCssFallback: true,
  },
  p: {
    key: 'p',
    label: '段落',
    options: [
      { key: 'color', label: '颜色', type: 'color', placeholder: '#333333' },
      { key: 'fontSize', label: '字号', type: 'select', options: fontSizeOptions },
      { key: 'lineHeight', label: '行高', type: 'text', placeholder: '1.8' },
      { key: 'margin', label: '外边距', type: 'margin' },
      { key: 'textAlign', label: '对齐', type: 'select', options: textAlignOptions },
    ],
    showCssFallback: true,
  },
  quote: {
    key: 'quote',
    label: '引用',
    options: [
      { key: 'borderLeftWidth', label: '左边框宽度', type: 'text', placeholder: '4px' },
      { key: 'borderLeftColor', label: '左边框颜色', type: 'color' },
      { key: 'backgroundColor', label: '背景色', type: 'color' },
      { key: 'color', label: '文字颜色', type: 'color' },
      { key: 'padding', label: '内边距', type: 'padding' },
      { key: 'margin', label: '外边距', type: 'margin' },
      { key: 'fontStyle', label: '字体样式', type: 'select', options: fontStyleOptions },
    ],
    showCssFallback: true,
  },
  code: {
    key: 'code',
    label: '行内代码',
    options: [
      { key: 'backgroundColor', label: '背景色', type: 'color' },
      { key: 'color', label: '文字颜色', type: 'color' },
      { key: 'padding', label: '内边距', type: 'padding' },
      { key: 'borderRadius', label: '圆角', type: 'text', placeholder: '4px' },
      { key: 'fontSize', label: '字号', type: 'select', options: fontSizeOptions },
    ],
    showCssFallback: true,
  },
  pre: {
    key: 'pre',
    label: '代码块',
    options: [
      { key: 'backgroundColor', label: '背景色', type: 'color' },
      { key: 'color', label: '文字颜色', type: 'color' },
      { key: 'padding', label: '内边距', type: 'padding' },
      { key: 'borderRadius', label: '圆角', type: 'text', placeholder: '8px' },
    ],
    showCssFallback: true,
  },
  ul: {
    key: 'ul',
    label: '无序列表',
    options: [
      { key: 'margin', label: '外边距', type: 'margin' },
      { key: 'padding', label: '内边距', type: 'padding' },
    ],
  },
  ol: {
    key: 'ol',
    label: '有序列表',
    options: [
      { key: 'margin', label: '外边距', type: 'margin' },
      { key: 'padding', label: '内边距', type: 'padding' },
    ],
  },
  li: {
    key: 'li',
    label: '列表项',
    options: [
      { key: 'margin', label: '外边距', type: 'margin' },
      { key: 'lineHeight', label: '行高', type: 'text', placeholder: '1.8' },
    ],
  },
  a: {
    key: 'a',
    label: '链接',
    options: [
      { key: 'color', label: '颜色', type: 'color' },
      { key: 'textDecoration', label: '装饰线', type: 'select', options: textDecorationOptions },
    ],
  },
  img: {
    key: 'img',
    label: '图片',
    options: [
      { key: 'maxWidth', label: '最大宽度', type: 'text', placeholder: '100%' },
      { key: 'borderRadius', label: '圆角', type: 'text', placeholder: '8px' },
      { key: 'margin', label: '外边距', type: 'margin' },
      { key: 'boxShadow', label: '阴影', type: 'text', placeholder: '0 4px 12px rgba(0,0,0,0.1)' },
    ],
    showCssFallback: true,
  },
  hr: {
    key: 'hr',
    label: '分割线',
    options: [
      { key: 'borderTopWidth', label: '线条粗细', type: 'text', placeholder: '1px' },
      { key: 'borderTopStyle', label: '线条样式', type: 'select', options: borderStyleOptions },
      { key: 'borderTopColor', label: '线条颜色', type: 'color' },
      { key: 'margin', label: '外边距', type: 'margin' },
    ],
  },
  table: {
    key: 'table',
    label: '表格',
    options: [
      { key: 'width', label: '宽度', type: 'text', placeholder: '100%' },
      { key: 'margin', label: '外边距', type: 'margin' },
    ],
  },
  th: {
    key: 'th',
    label: '表头',
    options: [
      { key: 'backgroundColor', label: '背景色', type: 'color' },
      { key: 'color', label: '文字颜色', type: 'color' },
      { key: 'fontWeight', label: '字重', type: 'select', options: fontWeightOptions },
      { key: 'padding', label: '内边距', type: 'padding' },
      { key: 'border', label: '边框', type: 'text', placeholder: '1px solid #e5e5e5' },
      { key: 'textAlign', label: '对齐', type: 'select', options: textAlignOptions },
    ],
    showCssFallback: true,
  },
  td: {
    key: 'td',
    label: '单元格',
    options: [
      { key: 'backgroundColor', label: '背景色', type: 'color' },
      { key: 'color', label: '文字颜色', type: 'color' },
      { key: 'padding', label: '内边距', type: 'padding' },
      { key: 'border', label: '边框', type: 'text', placeholder: '1px solid #e5e5e5' },
      { key: 'textAlign', label: '对齐', type: 'select', options: textAlignOptions },
    ],
    showCssFallback: true,
  },
  strong: {
    key: 'strong',
    label: '加粗',
    options: [
      { key: 'fontWeight', label: '字重', type: 'select', options: fontWeightOptions },
      { key: 'color', label: '颜色', type: 'color' },
    ],
  },
  em: {
    key: 'em',
    label: '斜体',
    options: [
      { key: 'fontStyle', label: '字体样式', type: 'select', options: fontStyleOptions },
      { key: 'color', label: '颜色', type: 'color' },
    ],
  },
  del: {
    key: 'del',
    label: '删除线',
    options: [
      { key: 'textDecoration', label: '删除线样式', type: 'select', options: textDecorationOptions },
      { key: 'color', label: '颜色', type: 'color' },
    ],
  },
  figcaption: {
    key: 'figcaption',
    label: '图片说明',
    options: [
      { key: 'fontSize', label: '字号', type: 'select', options: fontSizeOptions },
      { key: 'textAlign', label: '对齐', type: 'select', options: textAlignOptions },
      { key: 'color', label: '颜色', type: 'color' },
      { key: 'margin', label: '外边距', type: 'margin' },
    ],
    showCssFallback: true,
  },
};

// ==================== 辅助方法 ====================

function getFontStack(type: 'serif' | 'sans-serif'): string {
  const stacks: Record<'serif' | 'sans-serif', string> = {
    'sans-serif': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Microsoft YaHei", sans-serif',
    'serif': '"Noto Serif SC", "Source Han Serif SC", "Songti SC", Georgia, "Times New Roman", Optima-Regular, Cambria, Cochin, serif',
  };
  return stacks[type];
}

const getElementConfig = (key: string): ElementConfig | undefined => {
  return ELEMENT_CONFIGS[key];
};

const getStyleValue = (key: string, propKey: string): string => {
  const styles = editableStyles.value[key];
  if (!styles) return '';
  const value = styles[propKey as keyof StyleProperties];
  return typeof value === 'string' ? value : '';
};

// ==================== 分类配置 ====================

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
    { key: 'strong', label: '加粗' },
    { key: 'em', label: '斜体' },
    { key: 'del', label: '删除线' },
    { key: 'figcaption', label: '图片说明' },
  ],
};
</script>

<template>
  <div class="fixed inset-0 z-[60] flex flex-col bg-white dark:bg-gray-900">

    <!-- 顶部标题栏 -->
    <div class="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm flex-shrink-0">
      <div class="flex items-center gap-4">
        <h2 class="text-xl font-bold text-gray-800 dark:text-white">主题编辑器</h2>
        <input
          v-model="editingTheme.name"
          type="text"
          class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="主题名称"
        />
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="handleClose"
          class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          取消
        </button>
        <button
          @click="handleSave"
          class="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
        >
          保存
        </button>
        <button
          @click="handleSaveAs"
          class="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
        >
          另存为
        </button>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="flex-1 flex overflow-hidden">
      <!-- 左侧：样式编辑面板 -->
      <div class="w-[420px] flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">

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

        <!-- 样式编辑区域 -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3">

          <!-- ===== 全局样式编辑 ===== -->
          <div v-if="activeCategory === 'global'" class="space-y-4">
            <!-- 主题颜色 -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">主题颜色</label>
              <div class="flex items-center gap-2">
                <input
                  type="color"
                  :value="globalStyle.themeColor || '#c9a96e'"
                  @input="(e) => updateGlobalStyle('themeColor', (e.target as HTMLInputElement).value)"
                  class="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <input
                  type="text"
                  :value="globalStyle.themeColor || ''"
                  @input="(e) => updateGlobalStyle('themeColor', (e.target as HTMLInputElement).value)"
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
                  placeholder="#c9a96e"
                />
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400">统一控制标题装饰、边框、强调等色彩</p>
            </div>

            <!-- 背景颜色 -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">背景颜色</label>
              <div class="flex items-center gap-2">
                <input
                  type="color"
                  :value="globalStyle.backgroundColor || '#ffffff'"
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

            <!-- 默认字号 -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">默认字号</label>
              <select
                :value="globalStyle.fontSize || '15px'"
                @change="(e) => updateGlobalStyle('fontSize', (e.target as HTMLSelectElement).value)"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
              >
                <option v-for="opt in fontSizeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
            </div>

            <!-- 默认行高 -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">默认行高</label>
              <input
                type="text"
                :value="globalStyle.lineHeight || '1.8'"
                @input="(e) => updateGlobalStyle('lineHeight', (e.target as HTMLInputElement).value)"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
                placeholder="1.8"
              />
            </div>

            <!-- 字体类型 -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">字体类型</label>
              <div class="flex gap-3">
                <button
                  type="button"
                  @click="() => { updateGlobalStyle('fontType', 'sans-serif'); updateGlobalStyle('fontFamily', getFontStack('sans-serif')); }"
                  :class="[
                    'flex-1 px-3 py-2 rounded-lg border text-sm transition-colors',
                    (globalStyle.fontType || 'sans-serif') === 'sans-serif'
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'border-gray-300 bg-white text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200'
                  ]"
                >
                  非衬线（黑体）
                </button>
                <button
                  type="button"
                  @click="() => { updateGlobalStyle('fontType', 'serif'); updateGlobalStyle('fontFamily', getFontStack('serif')); }"
                  :class="[
                    'flex-1 px-3 py-2 rounded-lg border text-sm transition-colors',
                    globalStyle.fontType === 'serif'
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'border-gray-300 bg-white text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200'
                  ]"
                >
                  衬线（宋体）
                </button>
              </div>
            </div>

            <!-- 自定义字体 -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">自定义字体</label>
              <input
                type="text"
                :value="globalStyle.fontFamily || ''"
                @input="(e) => updateGlobalStyle('fontFamily', (e.target as HTMLInputElement).value)"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
                placeholder="留空使用默认字体栈"
              />
            </div>

            <!-- 容器内边距 -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">容器内边距</label>
              <input
                type="text"
                :value="globalStyle.containerPadding || '25px 8px'"
                @input="(e) => updateGlobalStyle('containerPadding', (e.target as HTMLInputElement).value)"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
                placeholder="25px 8px"
              />
            </div>
          </div>

          <!-- ===== 元素样式编辑 ===== -->
          <div v-else class="space-y-3">
            <template v-for="item in categoryItems[activeCategory]" :key="item.key">
              <div
                class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <!-- 可折叠标题栏 -->
                <button
                  @click="toggleExpand(item.key)"
                  class="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ item.label }}</span>
                  <svg
                    :class="['w-4 h-4 text-gray-500 transition-transform', expandedItems.has(item.key) ? 'rotate-180' : '']"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <!-- 编辑表单 -->
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

                  <!-- 选项列表 -->
                  <div class="space-y-2">
                    <template v-for="option in getElementConfig(item.key)?.options" :key="option.key">
                      <!-- 颜色选择器 -->
                      <div v-if="option.type === 'color'" class="space-y-1">
                        <label class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ option.label }}</label>
                        <div class="flex items-center gap-2">
                          <input
                            type="color"
                            :value="getStyleValue(item.key, option.key) || '#000000'"
                            @input="(e) => updateStyle(item.key, option.key, (e.target as HTMLInputElement).value)"
                            class="w-9 h-9 rounded border border-gray-300 dark:border-gray-600 cursor-pointer flex-shrink-0"
                          />
                          <input
                            type="text"
                            :value="getStyleValue(item.key, option.key)"
                            @input="(e) => updateStyle(item.key, option.key, (e.target as HTMLInputElement).value)"
                            class="flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs"
                            :placeholder="option.placeholder"
                          />
                        </div>
                      </div>

                      <!-- 下拉选择 -->
                      <div v-else-if="option.type === 'select'" class="space-y-1">
                        <label class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ option.label }}</label>
                        <select
                          :value="getStyleValue(item.key, option.key)"
                          @change="(e) => updateStyle(item.key, option.key, (e.target as HTMLSelectElement).value)"
                          class="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs"
                        >
                          <option value="">默认</option>
                          <option
                            v-for="opt in option.options"
                            :key="opt.value"
                            :value="opt.value"
                          >
                            {{ opt.label }}
                          </option>
                        </select>
                      </div>

                      <!-- 文本输入 -->
                      <div v-else-if="option.type === 'text'" class="space-y-1">
                        <label class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ option.label }}</label>
                        <input
                          type="text"
                          :value="getStyleValue(item.key, option.key)"
                          @input="(e) => updateStyle(item.key, option.key, (e.target as HTMLInputElement).value)"
                          class="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs"
                          :placeholder="option.placeholder"
                        />
                      </div>

                      <!-- 外边距 -->
                      <div v-else-if="option.type === 'margin'" class="space-y-1">
                        <label class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ option.label }}</label>
                        <input
                          type="text"
                          :value="getStyleValue(item.key, option.key)"
                          @input="(e) => updateStyle(item.key, option.key, (e.target as HTMLInputElement).value)"
                          class="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs"
                          placeholder="如: 16px 0"
                        />
                      </div>

                      <!-- 内边距 -->
                      <div v-else-if="option.type === 'padding'" class="space-y-1">
                        <label class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ option.label }}</label>
                        <input
                          type="text"
                          :value="getStyleValue(item.key, option.key)"
                          @input="(e) => updateStyle(item.key, option.key, (e.target as HTMLInputElement).value)"
                          class="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs"
                          placeholder="如: 12px"
                        />
                      </div>
                    </template>
                  </div>

                  <!-- CSS 回退输入 -->
                  <div v-if="getElementConfig(item.key)?.showCssFallback" class="space-y-1 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <label class="text-xs font-medium text-gray-600 dark:text-gray-400">其他 CSS</label>
                    <textarea
                      :value="toCSSString(editableStyles[item.key] || {})"
                      @input="(e) => {
                        const parsed = parseCSSString((e.target as HTMLTextAreaElement).value);
                        Object.keys(parsed).forEach(key => {
                          updateStyle(item.key, key, parsed[key] || '');
                        });
                      }"
                      class="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-mono text-xs"
                      rows="2"
                      placeholder="如: letter-spacing: 2px;"
                    />
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- 右侧：实时预览 -->
      <div class="flex-1 flex flex-col bg-gray-100 dark:bg-gray-800">
        <div class="flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">实时预览</span>
        </div>
        <div class="flex-1 flex items-center justify-center p-8 overflow-auto">
          <Preview
            :content="content"
            :theme="editingTheme"
          />
        </div>
      </div>
    </div>
  </div>
</template>
