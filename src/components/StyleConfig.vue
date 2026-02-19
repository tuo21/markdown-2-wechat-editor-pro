<script setup lang="ts">
/**
 * StyleConfig.vue - 主题选择和配置组件
 * 
 * 位于主界面顶部，提供：
 * 1. 主题下拉选择器
 * 2. 新建主题按钮（基于当前主题创建）
 * 3. 编辑主题按钮
 * 4. 删除主题按钮（仅自定义主题可删除）
 */

import { computed } from 'vue';
import type { Theme } from '../types';

// ==================== 组件接口定义 ====================

interface Props {
  themes: Theme[];        // 所有可用主题列表
  currentThemeId: string; // 当前选中的主题 ID
}

interface Emits {
  (e: 'update:currentThemeId', id: string): void;  // 更新当前主题
  (e: 'openEditor', theme: Theme): void;           // 打开主题编辑器
  (e: 'deleteTheme', id: string): void;            // 删除主题
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// ==================== 方法 ====================

/**
 * 处理主题下拉选择变化
 */
const handleThemeChange = (e: Event) => {
  const target = e.target as HTMLSelectElement;
  emit('update:currentThemeId', target.value);
};

/**
 * 获取当前选中的主题对象
 */
const getCurrentTheme = (): Theme | undefined => {
  return props.themes.find(t => t.id === props.currentThemeId);
};

/**
 * 判断当前主题是否为自定义主题
 */
const isCurrentThemeCustom = computed(() => {
  const theme = getCurrentTheme();
  return theme?.isCustom ?? false;
});

/**
 * 处理新建主题
 * 基于当前主题创建一个副本，并打开编辑器
 */
const handleCreateTheme = () => {
  const currentTheme = getCurrentTheme();
  if (currentTheme) {
    emit('openEditor', {
      ...currentTheme,
      id: `custom-${Date.now()}`,  // 生成新的唯一 ID
      name: `${currentTheme.name} (副本)`,
      isCustom: true
    });
  }
};

/**
 * 处理编辑主题
 * 打开编辑器编辑当前主题
 */
const handleEditTheme = () => {
  const currentTheme = getCurrentTheme();
  if (currentTheme) {
    emit('openEditor', { ...currentTheme });
  }
};

/**
 * 处理删除主题
 * 确认后删除当前自定义主题
 */
const handleDeleteTheme = () => {
  if (confirm('确定要删除这个主题吗？')) {
    emit('deleteTheme', props.currentThemeId);
  }
};
</script>

<template>
  <!-- 主题配置栏：灰色背景，水平布局 -->
  <div class="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <!-- 左侧：主题选择器 -->
    <div class="flex items-center space-x-2">
      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">主题：</label>
      <!-- 主题下拉选择框 -->
      <select
        :value="currentThemeId"
        @change="handleThemeChange"
        class="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option
          v-for="theme in themes"
          :key="theme.id"
          :value="theme.id"
        >
          {{ theme.name }}
          <!-- 自定义主题标记 -->
          <span v-if="theme.isCustom" class="ml-1 text-xs text-blue-500">(自定义)</span>
        </option>
      </select>
    </div>
    
    <!-- 右侧：操作按钮组 -->
    <div class="flex items-center space-x-2">
      <!-- 新建主题按钮 -->
      <button
        @click="handleCreateTheme"
        class="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="基于当前主题创建新主题"
      >
        <span class="flex items-center space-x-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>新建</span>
        </span>
      </button>
      
      <!-- 编辑主题按钮 -->
      <button
        @click="handleEditTheme"
        class="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="编辑当前主题"
      >
        <span class="flex items-center space-x-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>编辑</span>
        </span>
      </button>
      
      <!-- 删除主题按钮（仅自定义主题显示） -->
      <button
        v-if="isCurrentThemeCustom"
        @click="handleDeleteTheme"
        class="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        title="删除当前主题"
      >
        <span class="flex items-center space-x-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>删除</span>
        </span>
      </button>
    </div>
  </div>
</template>
