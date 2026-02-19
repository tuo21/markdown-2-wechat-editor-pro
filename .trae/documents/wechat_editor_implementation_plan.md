# WeChat Editor Pro - 执行计划 (Implementation Plan)

## 项目概述

根据产品需求文档，构建一款轻量级、无需后端的Web版微信公众号排版工具，支持Markdown编写、实时预览、主题自定义和一键复制为微信兼容的富文本。

***

## \[ ] Task 1: 项目初始化与依赖安装

* **Priority**: P0

* **Depends On**: None

* **Description**:

  * 使用 Vite 初始化 Vue3 + TypeScript 项目

  * 安装所需依赖：markdown-it、lucide-vue-next、clsx、tailwindcss、postcss、autoprefixer

  * 配置 TailwindCSS

  * 建立项目目录结构

  * 定义 TypeScript 类型接口

* **Success Criteria**:

  * 项目初始化完成，依赖安装成功

  * TailwindCSS 配置生效

  * 目录结构符合 PRD 要求

  * TypeScript 类型定义完整

* **Test Requirements**:

  * `programmatic` TR-1.1: 运行 `npm install` 无错误

  * `programmatic` TR-1.2: 运行 `npm run dev` 启动成功

  * `human-judgement` TR-1.3: 目录结构清晰，符合规范

* **Notes**: 保持项目轻量，避免引入不必要的依赖

***

## \[ ] Task 2: 核心编辑与预览功能

* **Priority**: P0

* **Depends On**: Task 1

* **Description**:

  * 实现 `useMarkdown` composable，配置 markdown-it 实例

  * 开发 `Editor.vue` 组件（Markdown 输入框 + 字数统计）

  * 开发 `Preview.vue` 组件（375px 宽度容器，实时渲染）

  * 在 `App.vue` 中连接 Editor 和 Preview

* **Success Criteria**:

  * Markdown 输入实时渲染到预览区

  * 预览区宽度固定为 375px，居中显示

  * 字数统计准确

* **Test Requirements**:

  * `programmatic` TR-2.1: 输入 Markdown 文本，预览区同步更新

  * `human-judgement` TR-2.2: 预览区视觉效果符合手机端体验

* **Notes**: 使用原生 textarea 保持轻量，后续可考虑升级为 Monaco Editor

***

## \[ ] Task 3: 样式系统与主题管理

* **Priority**: P0

* **Depends On**: Task 2

* **Description**:

  * 在 `themes.ts` 中定义 3 个默认主题（默认简约、科技蓝、文艺黑）

  * 开发 `StyleConfig.vue` 组件（主题选择器 + 样式调整）

  * 实现样式动态应用逻辑

  * 开发 `useStorage` composable（localStorage 封装）

* **Success Criteria**:

  * 3 个默认主题可用

  * 主题切换实时生效

  * 样式配置和内容自动保存到 localStorage

  * 刷新页面后自动恢复

* **Test Requirements**:

  * `programmatic` TR-3.1: 切换主题，预览区样式立即更新

  * `programmatic` TR-3.2: 刷新浏览器，内容和主题保持不变

  * `human-judgement` TR-3.3: 主题样式美观，符合微信公众号阅读习惯

* **Notes**: 使用 CSS 变量或动态 style 标签实现主题切换

***

## \[ ] Task 4: 一键复制功能

* **Priority**: P0

* **Depends On**: Task 3

* **Description**:

  * 实现 `useClipboard` composable（核心是 CSS 内联化逻辑）

  * 开发 `Toolbar.vue` 组件（主题选择 + 复制按钮）

  * 开发 `Toast.vue` 组件（反馈提示）

  * 实现完整的复制流程：克隆 DOM → 内联样式 → 清洗 → 写入剪贴板

* **Success Criteria**:

  * 点击复制按钮后，内容成功写入剪贴板

  * 复制的内容包含完整的内联样式

  * 粘贴到微信公众号编辑器后样式完整

  * 显示成功/失败的 Toast 提示

* **Test Requirements**:

  * `programmatic` TR-4.1: 点击复制按钮，控制台无错误

  * `human-judgement` TR-4.2: 粘贴到微信文件传输助手，样式完整无缺失

  * `human-judgement` TR-4.3: Toast 提示清晰友好

* **Notes**: 只内联微信支持的关键样式，避免代码过长

***

## \[ ] Task 5: 优化与交付

* **Priority**: P1

* **Depends On**: Task 4

* **Description**:

  * 添加暗黑模式支持（UI 界面暗黑，预览区保持白色）

  * 添加"清空内容"确认对话框

  * 代码审查：移除 console.log，确保 TypeScript 无报错

  * 运行构建测试：`npm run build` 无错误

  * 编写 README.md

* **Success Criteria**:

  * 暗黑模式切换正常

  * 清空内容有确认提示

  * TypeScript 编译无错误

  * 构建成功，输出 dist 目录

  * README.md 文档完整

* **Test Requirements**:

  * `programmatic` TR-5.1: 运行 `npm run build` 无错误

  * `programmatic` TR-5.2: TypeScript 类型检查通过

  * `human-judgement` TR-5.3: 暗黑模式视觉效果良好

* **Notes**: 确保构建产物体积小，加载快

***

## 优化调整说明

### 对 PRD 的优化：

1. **主题数据结构优化**：将主题样式从 CSS 字符串改为结构化对象，便于动态调整
2. **添加 DOMPurify**：PRD 提到可选使用，计划纳入核心依赖以增强安全性
3. **图片处理**：添加简单的图片上传提示逻辑
4. **组件命名**：保持与 PRD 一致，但增强了组件的复用性

### 技术选型确认：

* 原生 textarea（而非 Monaco Editor）以保持轻量

* TailwindCSS 用于 UI，自定义 CSS 用于内容排版

* localStorage 用于数据持久化

