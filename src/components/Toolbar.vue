<script setup lang="ts">
/**
 * Toolbar.vue - 顶部工具栏组件
 * 
 * 提供主要操作按钮：
 * 1. 应用 Logo 和标题
 * 2. 清空内容按钮
 * 3. 深色/亮色模式切换
 * 4. 复制到公众号按钮（主要操作）
 */

import { Copy, Sun, Moon, Trash2 } from 'lucide-vue-next';

// ==================== 组件接口定义 ====================

interface Props {
  onCopy: () => void;       // 复制按钮回调
  onToggleDark: () => void; // 切换深色模式回调
  onClear: () => void;      // 清空内容回调
  isDark: boolean;          // 当前是否为深色模式
}

const props = defineProps<Props>();
</script>

<template>
  <!-- 工具栏容器：白色背景，水平布局 -->
  <div class="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
    <!-- 左侧：Logo 和标题 -->
    <div class="flex items-center space-x-3">
      <!-- Logo 图标 -->
      <img src="/icon.svg" alt="Logo" class="w-8 h-8 rounded-lg" />
      <!-- 应用标题 -->
      <h1 class="text-xl font-bold text-gray-800 dark:text-white">WeChat Editor Pro</h1>
    </div>
    
    <!-- 右侧：操作按钮组 -->
    <div class="flex items-center space-x-3">
      <!-- 清空内容按钮 -->
      <button
        @click="onClear"
        class="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        title="清空内容"
      >
        <Trash2 class="w-4 h-4" />
        <span class="hidden sm:inline">清空</span>
      </button>
      
      <!-- 深色/亮色模式切换按钮 -->
      <button
        @click="onToggleDark"
        class="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        :title="isDark ? '切换亮色' : '切换暗色'"
      >
        <!-- 根据当前模式显示不同图标 -->
        <component :is="isDark ? Sun : Moon" class="w-4 h-4" />
        <span class="hidden sm:inline">{{ isDark ? '亮色' : '暗色' }}</span>
      </button>
      
      <!-- 复制到公众号按钮（主要操作，蓝色高亮） -->
      <button
        @click="onCopy"
        class="flex items-center space-x-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-sm"
      >
        <Copy class="w-4 h-4" />
        <span>复制到公众号</span>
      </button>
    </div>
  </div>
</template>
