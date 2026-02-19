# 产品需求文档 (PRD) - 微信公众号排版软件 (WeChat Editor Pro)

| 文档版本     | V1.0.0                                 |
| ------------ | -------------------------------------- |
| **撰写人**   | 产品经理 (AI Assistant)                |
| **日期**     | 2026-02-17                             |
| **状态**     | 待开发                                 |
| **目标读者** | AI 开发代理 (Coding Agent)、前端工程师 |
| **项目类型** | Web 单页应用 (SPA)                     |

------

## 1. 项目概述 (Project Overview)

### 1.1 产品目标

构建一款轻量级、无需后端的 Web 版微信公众号排版工具。用户可通过 Markdown 编写内容，实时预览微信样式，自定义主题模板，并一键复制为微信公众号编辑器兼容的富文本 HTML。

### 1.2 核心技术栈 (2026 Standard)

- **框架:** Vue 3.4+ (Composition API, `<script setup>`)
- **语言:** TypeScript 5.0+
- **构建工具:** Vite 5.0+
- **样式:** TailwindCSS 3.4+ (用于 UI 界面) + 自定义 CSS 变量 (用于排版内容)
- **Markdown 解析:** `markdown-it` (需配置常见插件)
- **图标库:** `lucide-vue-next`
- **存储:** 浏览器 `localStorage` (无需后端数据库)
- **部署:** 静态资源托管 (Vercel/GitHub Pages/Nginx)

### 1.3 架构原则

- **Pure Frontend:** 所有逻辑在客户端运行，无 API 请求。
- **Responsive:** 适配桌面端为主，兼容平板。
- **Performance:** 首屏加载 < 1s，千字文章渲染 < 100ms。

------

## 2. 功能模块详解 (Functional Specifications)

### 2.1 模块一：编辑器 (Markdown Editor)

- **输入框:** 多行文本域，支持 Monaco Editor 或原生 `textarea` (建议原生以保持轻量，配合语法高亮插件)。
- 功能:
  - 支持标准 Markdown 语法。
  - 支持粘贴纯文本自动转换。
  - 底部显示字数统计。
- **数据绑定:** 双向绑定至全局状态 `contentMarkdown`。

### 2.2 模块二：预览区 (Preview Panel)

- **容器:** 模拟 iPhone 屏幕宽度的容器 (宽 375px，居中)。
- 渲染逻辑:
  - 使用 `markdown-it` 将 `contentMarkdown` 转换为 HTML。
  - 应用当前选中的 **主题样式 (Theme CSS)**。
  - **注意:** 预览时使用 CSS 类名或变量，**复制时**才转换为内联样式。
- **交互:** 点击预览区不可编辑，仅展示。

### 2.3 模块三：样式引擎 (Style Engine)

- 主题管理:

  - 内置 3 套主题 (默认、科技蓝、文艺黑)。
  - 支持用户保存自定义主题到 `localStorage`。

- 样式配置项 (全局):

  - `font-family`: 字体
  - `font-size`: 字号 (14px-18px)
  - `color`: 文字颜色
  - `line-height`: 行高 (1.5-2.0)
  - `background-color`: 背景色

- 数据结构 (Theme Interface):

  ```typescript
  interface Theme {
    id: string;
    name: string;
    styles: {
      h1: string; h2: string; p: string; quote: string; code: string; // CSS 字符串片段
      global: { fontSize: string; lineHeight: string; color: string; };
    };
  }
  ```

### 2.4 模块四：一键复制 (Export & Copy)

- 核心逻辑:
  1. 获取预览区的 DOM 元素。
  2. **CSS 内联化 (Inline CSS):** 遍历 DOM 节点，将计算后的样式 (Computed Styles) 或主题定义的样式写入节点的 `style` 属性。
  3. **清洗:** 移除微信不支持的标签 (如 `script`, `iframe`, `position: fixed`)。
  4. **写入剪贴板:** 使用 `navigator.clipboard.write()` 写入 HTML 格式数据。
- **反馈:** 复制成功后显示 Toast 提示 "复制成功，请直接粘贴到公众号后台"。

### 2.5 模块五：本地存储 (Local Storage)

- Key 定义:
  - `wechat_editor_content`: 保存当前编辑内容 (防丢失)。
  - `wechat_editor_themes`: 保存用户自定义主题列表 (JSON 字符串)。
  - `wechat_editor_current_theme_id`: 当前选中的主题 ID。
- **策略:** 每次内容变更防抖 (debounce) 500ms 后保存。

------

## 3. 项目文件结构 (File Structure)

AI 开发时需严格遵循以下目录结构：

```text
src/
├── assets/              # 静态资源
├── components/
│   ├── Editor.vue       # Markdown 输入组件
│   ├── Preview.vue      # 微信预览组件
│   ├── Toolbar.vue      # 顶部工具栏 (主题选择、复制按钮)
│   ├── StyleConfig.vue  # 样式配置面板
│   └── Toast.vue        # 提示框组件
├── composables/
│   ├── useMarkdown.ts   # Markdown 解析逻辑
│   ├── useClipboard.ts  # 复制逻辑 (含 CSS 内联处理)
│   └── useStorage.ts    # localStorage 封装
├── styles/
│   ├── main.css         # Tailwind 指令
│   └── themes.ts        # 主题样式定义常量
├── types/
│   └── index.ts         # TypeScript 接口定义
├── App.vue              # 主布局
├── main.ts              # 入口文件
└── vite-env.d.ts
```

------

## 4. 执行清单 (Execution Checklist)

**请 AI 开发者严格按照以下顺序执行开发任务，每完成一步需自测。**

### 阶段 1: 项目初始化 (Setup)

- **1.1** 使用 `npm create vite@latest` 创建 Vue3 + TypeScript 项目。
- **1.2** 安装依赖：`markdown-it`, `lucide-vue-next`, `clsx`, `tailwindcss`, `postcss`, `autoprefixer`。
- **1.3** 配置 TailwindCSS (`tailwind.config.js`) 并初始化 `src/styles/main.css`。
- **1.4** 清理默认模板文件，建立上述 **第 3 节** 定义的目录结构。
- **1.5** 在 `src/types/index.ts` 中定义 `Theme`, `EditorState` 等接口。

### 阶段 2: 核心编辑与解析 (Core Logic)

- **2.1** 实现 `src/composables/useMarkdown.ts`：初始化 `markdown-it` 实例，启用表格、链接插件。
- **2.2** 开发 `src/components/Editor.vue`：实现 textarea 输入，绑定 `v-model`，集成字数统计。
- **2.3** 开发 `src/components/Preview.vue`：接收 Markdown 字符串，渲染为 HTML，设置容器宽 375px，背景白色，居中。
- **2.4** 联调：在 `App.vue` 中连接 Editor 和 Preview，确保输入实时渲染。

### 阶段 3: 样式系统 (Style System)

- **3.1** 在 `src/styles/themes.ts` 中定义 3 个默认主题对象 (JSON 格式 CSS 样式)。
- **3.2** 开发 `src/components/StyleConfig.vue`：提供下拉框选择主题，提供滑块/颜色选择器调整全局字号、颜色。
- **3.3** 实现样式应用逻辑：根据当前选中的主题，动态生成 `<style>` 标签注入到 Preview 组件中，或使用 CSS 变量控制。
- **3.4** 实现 `src/composables/useStorage.ts`：将主题配置和内容保存到 `localStorage`，刷新页面不丢失。

### 阶段 4: 复制与导出 (Export)

- 4.1

   实现 

  ```
  src/composables/useClipboard.ts
  ```

   中的 

  ```
  copyHTML
  ```

   函数。

  - **关键算法:** 克隆 Preview 节点的 DOM -> 遍历所有子节点 -> 获取 `window.getComputedStyle` -> 将关键样式写入 `style` 属性 -> 移除类名 -> 获取 `innerHTML`。
  - **注意:** 需处理图片 `src`，若为本地 blob 需提示用户，若为网络链接则保留。

- **4.2** 开发 `src/components/Toolbar.vue`：放置“复制”按钮，绑定点击事件。

- **4.3** 实现 Toast 反馈组件，复制成功后显示。

- **4.4** **自测:** 复制内容到微信文件传输助手，检查样式是否丢失。

### 阶段 5: 优化与交付 (Polish)

- **5.1** 添加暗黑模式支持 (UI 界面暗黑，预览区保持白色模拟手机)。
- **5.2** 添加“清空内容”确认对话框。
- **5.3** 代码审查：移除所有 `console.log`，确保 TypeScript 无报错。
- **5.4** 构建测试：运行 `npm run build`，确保无错误，输出 `dist` 目录。
- **5.5** 编写 `README.md`：包含启动命令、功能介绍、部署指南。

------

## 5. 关键逻辑伪代码 (Key Logic for AI)

### 5.1 CSS 内联化逻辑 (Copy Function)

```typescript
// src/composables/useClipboard.ts
export async function copyWeChatHTML(element: HTMLElement) {
  const clone = element.cloneNode(true) as HTMLElement;
  
  // 移除所有外部类名，强制内联样式
  const allElements = clone.querySelectorAll('*');
  allElements.forEach(el => {
    const computed = window.getComputedStyle(el);
    let styleString = '';
    // 只提取微信支持的关键样式，避免代码过长
    const keys = ['color', 'font-size', 'line-height', 'font-weight', 'background-color', 'text-align', 'margin', 'padding', 'border'];
    keys.forEach(key => {
      styleString += `${key}:${computed.getPropertyValue(key)};`;
    });
    el.setAttribute('style', styleString);
    el.removeAttribute('class');
  });

  const html = clone.innerHTML;
  const blob = new Blob([html], { type: 'text/html' });
  const item = new ClipboardItem({ 'text/html': blob, 'text/plain': new Blob([html], { type: 'text/plain' }) });
  
  await navigator.clipboard.write([item]);
}
```

### 5.2 主题数据结构

```typescript
// src/styles/themes.ts
export const DEFAULT_THEMES = [
  {
    id: 'default',
    name: '默认简约',
    styles: {
      h1: 'color: #1a1a1a; font-size: 24px; border-bottom: 2px solid #000; padding-bottom: 10px;',
      p: 'color: #333; font-size: 15px; line-height: 1.75;',
      quote: 'border-left: 4px solid #000; padding-left: 10px; color: #666;'
    }
  },
  // ... 更多主题
];
```

------

## 6. 验收标准 (Acceptance Criteria)

1. **功能完整性:** 5 大核心功能点全部实现，无缺失。
2. **兼容性:** 生成的 HTML 粘贴到微信公众号后台编辑器后，样式不乱码，无多余空白。
3. **持久化:** 刷新浏览器后，之前编辑的内容和选择的主题自动恢复。
4. **性能:** 输入无明显延迟，复制操作在 1 秒内完成反馈。
5. **代码质量:** TypeScript 类型定义完整，无 `any` 滥用，组件拆分合理。

------

## 7. 附录：注意事项

- **图片处理:** 鉴于纯前端限制，若用户粘贴本地图片，Markdown 解析后可能是 `blob:` 开头链接。复制时需检测，若为 `blob:` 链接，Toast 提示“建议先将图片上传至图床”。
- **微信限制:** 避免使用 `position: fixed`，避免使用外部字体引用 (除非是微信白名单字体)。
- **安全:** 使用 `DOMPurify` (可选) 防止 XSS 攻击，特别是在解析 HTML 片段时。

------

**致 AI 开发者:** 请根据此文档直接开始 **阶段 1** 的开发。如有歧义，优先保证“一键复制”功能的可用性。