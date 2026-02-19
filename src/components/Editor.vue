<script setup lang="ts">
/**
 * Editor.vue - Markdown 编辑器组件
 * 
 * 提供简洁的 Markdown 文本输入区域：
 * 1. 支持双向数据绑定（v-model）
 * 2. 显示字数统计
 * 3. 使用等宽字体便于编辑代码
 */

import { computed } from 'vue';

// ==================== 组件接口定义 ====================

interface Props {
  modelValue: string;  // 编辑器内容（v-model 绑定）
}

interface Emits {
  (e: 'update:modelValue', value: string): void;  // 内容更新事件
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// ==================== 计算属性 ====================

/**
 * 字数统计
 * 当前仅统计字符数，可根据需要扩展为区分中英文
 */
const wordCount = computed(() => {
  return props.modelValue.length;
});

// ==================== 方法 ====================

/**
 * 处理文本输入事件
 * 将新值通过 emit 发送给父组件
 */
const handleInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <!-- 编辑器容器：白色背景，垂直布局 -->
  <div class="flex flex-col h-full bg-white dark:bg-gray-900">
    <!-- 编辑器标题栏 -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Markdown 编辑</h2>
      <!-- 字数统计 -->
      <span class="text-sm text-gray-500 dark:text-gray-400">{{ wordCount }} 字</span>
    </div>
    
    <!-- 文本输入区域 -->
    <textarea
      :value="modelValue"
      @input="handleInput"
      class="flex-1 w-full p-4 resize-none border-none outline-none font-mono text-sm leading-relaxed bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400"
      placeholder="在此输入 Markdown 内容..."
    />
  </div>
</template>
