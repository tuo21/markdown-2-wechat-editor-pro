<script setup lang="ts">
/**
 * Toast.vue - 消息提示组件
 * 
 * 提供轻量级的消息提示功能：
 * 1. 支持三种类型：success（成功）、error（错误）、info（信息）
 * 2. 自动消失（默认 3 秒）
 * 3. 使用 Teleport 渲染到 body，避免层级问题
 * 4. 带有淡入淡出动画效果
 */

import { ref, watch } from 'vue';

// ==================== 组件接口定义 ====================

interface Props {
  show: boolean;                              // 是否显示
  message: string;                            // 消息内容
  type?: 'success' | 'error' | 'info';        // 消息类型
  duration?: number;                          // 显示时长（毫秒）
}

interface Emits {
  (e: 'close'): void;  // 关闭事件
}

// 设置默认值
const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 3000,
});

const emit = defineEmits<Emits>();

// ==================== 状态 ====================

/**
 * 实际可见状态
 * 用于控制动画过渡
 */
const visible = ref(false);

// ==================== 监听器 ====================

/**
 * 监听 show 属性变化
 * 显示时启动定时器自动关闭
 */
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      visible.value = true;
      // 设置定时器自动关闭
      if (props.duration > 0) {
        setTimeout(() => {
          visible.value = false;
          emit('close');
        }, props.duration);
      }
    } else {
      visible.value = false;
    }
  }
);

// ==================== 方法 ====================

/**
 * 根据消息类型返回对应的样式类
 */
const getTypeClasses = () => {
  switch (props.type) {
    case 'success':
      return 'bg-green-500 text-white';
    case 'error':
      return 'bg-red-500 text-white';
    case 'info':
    default:
      return 'bg-gray-800 text-white';
  }
};
</script>

<template>
  <!-- 使用 Teleport 将 Toast 渲染到 body -->
  <Teleport to="body">
    <!-- 淡入淡出过渡动画 -->
    <Transition name="toast">
      <div
        v-if="visible"
        class="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2"
        :class="getTypeClasses()"
      >
        <span>{{ message }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* 进入动画 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

/* 进入前和离开后的状态 */
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}
</style>
