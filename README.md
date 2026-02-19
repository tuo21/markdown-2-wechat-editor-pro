# WeChat Editor Pro

一款轻量级、无需后端的 Web 版微信公众号排版工具。

## 功能特性

- ✨ **Markdown 实时预览：左侧编辑，右侧实时渲染
- 🎨 **多种主题样式：内置默认简约、科技蓝、文艺黑三套主题
- 📋 **一键复制为微信兼容格式：自动内联样式，完美适配公众号
- 💾 **自动保存内容：使用 localStorage 自动保存，刷新不丢失
- 🌙 **暗黑模式支持：UI 支持亮色/暗色切换
- 📱 **手机模拟预览：375px 宽度，模拟手机端效果

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173/ 查看效果。

### 构建生产版本

```bash
npm run build
```

构建产物输出到 `dist` 目录。

## 使用说明

1. 在左侧输入框中编写 Markdown 内容
2. 在顶部选择喜欢的主题样式
3. 点击「复制到公众号」按钮
4. 直接粘贴到微信公众号后台编辑器即可

## 技术栈

- Vue 3.4+ (Composition API, `<script setup>`
- TypeScript 5.0+
- Vite 5.0+
- TailwindCSS 3.4+
- markdown-it
- lucide-vue-next
- localStorage

## 项目结构

```
src/
├── assets/              # 静态资源
├── components/          # Vue 组件
│   ├── Editor.vue       # Markdown 输入组件
│   ├── Preview.vue      # 微信预览组件
│   ├── Toolbar.vue      # 顶部工具栏
│   ├── StyleConfig.vue  # 样式配置面板
│   └── Toast.vue        # 提示框组件
├── composables/         # 组合式函数
│   ├── useMarkdown.ts   # Markdown 解析逻辑
│   ├── useClipboard.ts  # 复制逻辑
│   └── useStorage.ts    # localStorage 封装
├── styles/             # 样式
│   ├── main.css         # Tailwind 样式
│   └── themes.ts        # 主题定义
├── types/              # TypeScript 类型
├── App.vue              # 主应用
└── main.ts              # 入口文件
```

## 部署

构建完成后，可以将 `dist` 目录部署到任意静态资源托管服务，如：
- Vercel
- GitHub Pages
- Netlify
- Nginx

## License

MIT
