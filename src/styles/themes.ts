import type { Theme } from '../types';

/**
 * 内置主题配置
 *
 * 每个主题包含以下样式属性：
 * - global: 全局基础样式（字号、行高、字体、颜色、背景色）
 * - h1/h2/h3: 一级~三级标题样式
 * - p: 正文段落样式
 * - quote: 引用块样式（左边框颜色、内边距、背景色）
 * - code: 行内代码样式（背景色、文字色）
 * - pre: 代码块整体样式（背景色、圆角、内边距）
 * - ul/ol: 无序/有序列表外层容器
 * - li: 列表项样式
 * - a: 超链接样式（文字色、下划线）
 * - img: 图片样式（宽度、圆角、间距、阴影）
 * - hr: 分隔线样式（粗细、颜色、间距）
 * - table/th/td: 表格/表头/单元格样式
 */
export const DEFAULT_THEMES: Theme[] = [
  // ==================== 默认简约 ====================
  {
    id: 'default',
    name: '默认简约',
    description: '简洁现代的无衬线风格，适合技术类文章',
    styles: {
      /* ── 全局基础 ── */
      global: {
        fontSize: '15px',          // 基础字号
        lineHeight: '1.75',        // 行高
        color: '#333333',          // 正文字色
        backgroundColor: '#ffffff', // 背景色
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        themeColor: '#000000',     // 主题色：黑色装饰（边框、分隔线）
        fontType: 'sans-serif',    // 非衬线体
      },
      /* ── 标题层级 ── */
      h1: 'color: #1a1a1a; font-size: 24px; font-weight: 700; margin: 24px 0 16px; padding-bottom: 10px; border-bottom: 2px solid #e5e5e5;',
      h2: 'color: #1a1a1a; font-size: 20px; font-weight: 600; margin: 20px 0 12px;',
      h3: 'color: #1a1a1a; font-size: 18px; font-weight: 600; margin: 18px 0 10px;',
      /* ── 正文段落 ── */
      p: 'color: #333; font-size: 15px; line-height: 1.75; margin: 0 0 16px;',
      /* ── 引用块 ── */
      quote: 'border-left: 4px solid #000000; padding: 12px 16px; margin: 16px 0; color: #666; background: #f9f9f9;',
      /* ── 代码 ── */
      code: 'background: #f4f4f4; padding: 2px 6px; border-radius: 4px; font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace; font-size: 14px; color: #e83e8c;',
      pre: 'background: #2d2d2d; color: #f8f8f2; padding: 16px; border-radius: 8px; overflow-x: auto; margin: 16px 0;',
      /* ── 列表 ── */
      ul: 'margin: 12px 0 16px 24px; padding: 0;',
      ol: 'margin: 12px 0 16px 24px; padding: 0;',
      li: 'margin: 8px 0; line-height: 1.75;',
      /* ── 链接 ── */
      a: 'color: #1890ff; text-decoration: none;',
      /* ── 图片 ── */
      img: 'max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0; display: block;',
      /* ── 分割线 ── */
      hr: 'border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;',
      /* ── 表格 ── */
      table: 'width: 100%; border-collapse: collapse; margin: 16px 0;',
      th: 'background: #f5f5f5; padding: 10px; border: 1px solid #e5e5e5; text-align: left; font-weight: 600;',
      td: 'padding: 10px; border: 1px solid #e5e5e5;',
    },
  },

  // ==================== 科技蓝 ====================
  {
    id: 'tech-blue',
    name: '科技蓝',
    description: '蓝色调科技风格，适合开发文档和教程类文章',
    styles: {
      /* ── 全局基础 ── */
      global: {
        fontSize: '15px',
        lineHeight: '1.8',
        color: '#2c3e50',
        backgroundColor: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        themeColor: '#1890ff',     // 主题色：蓝色
        fontType: 'sans-serif',    // 非衬线体
      },
      /* ── 标题：蓝色系，H2带左侧色条 ── */
      h1: 'color: #1890ff; font-size: 26px; font-weight: 700; margin: 24px 0 16px; padding-bottom: 12px; border-bottom: 3px solid #1890ff;',
      h2: 'color: #096dd9; font-size: 21px; font-weight: 600; margin: 20px 0 12px; border-left: 4px solid #1890ff; padding-left: 12px;',
      h3: 'color: #1890ff; font-size: 18px; font-weight: 600; margin: 18px 0 10px;',
      /* ── 正文 ── */
      p: 'color: #2c3e50; font-size: 15px; line-height: 1.8; margin: 0 0 16px;',
      /* ── 引用块：浅蓝背景 + 左侧蓝边 ── */
      quote: 'border-left: 4px solid #1890ff; padding: 14px 18px; margin: 16px 0; color: #595959; background: #e6f7ff; border-radius: 0 6px 6px 0;',
      /* ── 代码：浅蓝底 + 蓝字 ── */
      code: 'background: #f0f5ff; padding: 3px 8px; border-radius: 4px; font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace; font-size: 14px; color: #1890ff;',
      pre: 'background: #001529; color: #d6deeb; padding: 18px; border-radius: 8px; overflow-x: auto; margin: 16px 0;',
      /* ── 列表 ── */
      ul: 'margin: 12px 0 16px 24px; padding: 0;',
      ol: 'margin: 12px 0 16px 24px; padding: 0;',
      li: 'margin: 8px 0; line-height: 1.8;',
      /* ── 链接：蓝色下划线 ── */
      a: 'color: #1890ff; text-decoration: underline;',
      /* ── 图片：带蓝色阴影 ── */
      img: 'max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0; display: block; box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);',
      /* ── 分割线：蓝色双线 ── */
      hr: 'border: none; border-top: 2px solid #1890ff; margin: 24px 0;',
      /* ── 表格：蓝色表头 ── */
      table: 'width: 100%; border-collapse: collapse; margin: 16px 0;',
      th: 'background: #1890ff; color: white; padding: 12px; border: 1px solid #096dd9; text-align: left; font-weight: 600;',
      td: 'padding: 10px; border: 1px solid #d9d9d9;',
    },
  },

  // ==================== 文艺黑 ====================
  {
    id: 'art-dark',
    name: '文艺黑',
    description: '衬线字体风格，适合人文、阅读类文章',
    styles: {
      /* ── 全局基础：衬线字体 ── */
      global: {
        fontSize: '16px',
        lineHeight: '1.9',
        color: '#1a1a1a',
        backgroundColor: '#ffffff',
        fontFamily: '"Noto Serif SC", "Source Han Serif SC", "Songti SC", Georgia, serif',
        themeColor: '#000000',     // 主题色：黑色
        fontType: 'serif',         // 衬线体
      },
      /* ── 标题：黑色居中，H1加大间距 ── */
      h1: 'color: #000; font-size: 28px; font-weight: 700; margin: 32px 0 20px; text-align: center; letter-spacing: 2px;',
      h2: 'color: #000; font-size: 22px; font-weight: 600; margin: 28px 0 16px; padding-bottom: 8px; border-bottom: 1px solid #ddd;',
      h3: 'color: #333; font-size: 19px; font-weight: 600; margin: 24px 0 14px;',
      /* ── 正文：两端对齐，增大行高 ── */
      p: 'color: #2a2a2a; font-size: 16px; line-height: 1.9; margin: 0 0 20px; text-align: justify;',
      /* ── 引用块：黑色左边框 + 斜体 ── */
      quote: 'border-left: 3px solid #000; padding: 16px 20px; margin: 24px 0; color: #444; background: #fafafa; font-style: italic;',
      /* ── 代码：灰底黑字 ── */
      code: 'background: #f0f0f0; padding: 2px 8px; border-radius: 3px; font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace; font-size: 14px; color: #000;',
      pre: 'background: #1a1a1a; color: #e8e8e8; padding: 20px; border-radius: 4px; overflow-x: auto; margin: 20px 0;',
      /* ── 列表 ── */
      ul: 'margin: 16px 0 20px 28px; padding: 0;',
      ol: 'margin: 16px 0 20px 28px; padding: 0;',
      li: 'margin: 10px 0; line-height: 1.9;',
      /* ── 链接：黑色下划线 ── */
      a: 'color: #000; text-decoration: underline;',
      /* ── 图片：无装饰 ── */
      img: 'max-width: 100%; height: auto; margin: 24px 0; display: block;',
      /* ── 分割线：黑色实线 ── */
      hr: 'border: none; border-top: 1px solid #000; margin: 32px 0;',
      /* ── 表格 ── */
      table: 'width: 100%; border-collapse: collapse; margin: 20px 0;',
      th: 'background: #f5f5f5; padding: 12px; border: 1px solid #ddd; text-align: left; font-weight: 600;',
      td: 'padding: 10px; border: 1px solid #ddd;',
    },
  },

  // ==================== 简约金（金色调） ====================
  {
    id: 'simple-gold',
    name: '简约金',
    description: '温暖金色调，参考微信公众号经典排版风格（135编辑器/秀米等），适合情感、随笔类文章',
    styles: {
      /* ═══ 全局基础 ═══ */
      global: {
        fontSize: '17px',           // 微信推荐字号 17px
        lineHeight: '1.8',          // 行高 1.8em，阅读舒适
        color: '#3a3a3a',           // 深灰色正文，不刺眼
        backgroundColor: '#ffffff',
        fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", -apple-system, sans-serif',
        themeColor: '#f9bf45',     // 主题色：金黄色
        fontType: 'sans-serif',    // 非衬线体
      },
      // 大号标题，底部金色分隔线
      h1: 'font-size: 2.1em; line-height: 1.1em; color: #515151; font-weight: 700; margin: 30px 0 4px; padding-top: 16px; padding-bottom: 10px; border-bottom: 1px solid #c99833;',

      /* ═══ 二级标题 H2 ═══ */
      // 金色渐变下划线高亮效果
      h2: 'font-size: 19px; line-height: 1.5em; color: #515151; font-weight: bold; background: linear-gradient(#fff 60%, #ffb11b 40%); padding: 2px 13px; display: inline-block; margin: 35px 0 25px 0;',

      /* ═══ 三级标题 H3 ═══ */
      // 左侧金色竖线标记
      h3: 'font-size: 17px; line-height: 1.4; color: #515151; font-weight: 700; padding-left: 20px; border-left: 3px solid #f9bf45; margin: 22px 0 5px;',

      /* ═══ 正文段落 P ═══ */
      // 两端对齐，适当段间距
      p: 'color: #3a3a3a; font-size: 17px; line-height: 1.8em; margin: 0 0 20px; padding: 0; text-align: justify;',

      /* ═══ 引用块 BLOCKQUOTE ═══ */
      // 金色左边框 + 暖黄背景
      quote: 'border-left: 3px solid #ffb11b; padding: 14px 18px; margin: 20px 0; color: #595959; background: #fff5e3; line-height: 1.9;',

      /* ═══ 行内代码 CODE ═══ */
      // 暖黄背景 + 深金文字
      code: 'color: #9b6e23; background-color: #fff5e3; padding: 3px; margin: 3px; font-family: "SF Mono", Consolas, "Liberation Mono", Menlo, monospace; font-size: 14px; border-radius: 2px;',

      /* ═══ 代码块 PRE ═══ */
      pre: 'background: #2d2a24; color: #e8e4d9; padding: 18px; border-radius: 4px; overflow-x: auto; margin: 20px 0; line-height: 1.6;',

      /* ═══ 无序列表 UL ═══ */
      ul: 'margin: 12px 0 18px 24px; padding: 0; list-style-type: disc;',

      /* ═══ 有序列表 OL ═══ */
      ol: 'margin: 12px 0 18px 24px; padding: 0; list-style-type: decimal;',

      /* ═══ 列表项 LI ═══ */
      li: 'margin: 10px 0; line-height: 1.8; color: #3a3a3a;',

      /* ═══ 链接 A ═══ */
      // 金色无下划线，悬停变亮并显示下划线
      a: 'color: #dda52d; border: none; text-decoration: none; transition: all 0.2s ease;',

      /* ═══ 图片 IMG ═══ */
      // 圆角 + 底部留白
      img: 'width: 100%; height: auto; border-radius: 5px; display: block; margin: 0 0 15px;',

      /* ═══ 分割线 HR ═══ */
      // 金色细线
      hr: 'border: none; border-top: 1px solid #f9bf45; margin: 20px 0;',

      /* ═══ 表格 TABLE ═══ */
      table: 'width: 100%; border-collapse: collapse; margin: 18px 0;',

      /* ═══ 表头 TH ═══ */
      // 居中排列
      th: 'background: #fff5e3; padding: 11px 14px; border: 1px solid #e8dcc0; text-align: center; font-weight: 600; color: #555;',

      /* ═══ 单元格 TD ═══ */
      td: 'padding: 10px 14px; border: 1px solid #edeae3; color: #444; text-align: center;',

      /* ═══ 扩展样式 ═══ */

      // 加粗：黑色强调
      strong: 'color: black; font-weight: bold;',

      // 斜体
      em: 'color: #666; font-style: italic;',

      // 删除线：金色调
      del: 'color: #d19826; text-decoration: line-through;',

      // 图片描述文字
      figcaption: 'color: #dda52d; font-size: 14px; text-align: center; margin-top: -8px; margin-bottom: 15px;',
    },
  },

  // ==================== 简约宋（markdown.com.cn 经典风格） ====================
  {
    id: 'simple-song',
    name: '简约宋',
    description: '提取自 markdown.com.cn 编辑器的经典排版风格，衬线字体+金黄色单色点缀，适合产品介绍、工具说明类文章',
    styles: {
      /* ═══ 全局基础 ═══ */
      global: {
        fontSize: '16px',
        lineHeight: '1.6',            // 容器行高
        color: 'black',
        backgroundColor: '#ffffff',
        fontFamily: 'Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, "PingFang SC", Cambria, Cochin, Georgia, Times, "Times New Roman", serif',
        containerPadding: '25px 8px',  // 容器内边距（微信文章典型值）
        themeColor: '#f9bf45',       // 主题色：金黄色（H3竖条、分割线等）
        fontType: 'serif',           // 衬线体
      },

      /* ═══ 标题 H3 作为实际一级标题使用 ═══ */
      // 外层容器样式
      h1: 'font-weight: bold; color: black; font-size: 22px; line-height: 1.4; margin: 30px 0 15px; padding-top: 16px;',
      h2: 'font-weight: bold; color: black; font-size: 21px; line-height: 1.4; margin: 28px 0 12px; padding-top: 12px;',
      // H3 带左侧金色竖条标记（核心特征）
      h3: 'font-weight: bold; color: black; font-size: 20px; line-height: 1.4; padding-top: 10px; margin: 10px 0 5px;',

      /* ═══ 正文段落 P ═══ */
      p: 'font-size: 16px; margin: 0 0 20px; padding: 0; line-height: 1.8em; color: #3a3a3a;',

      /* ═══ 引用块 BLOCKQUOTE ═══ */
      quote: 'border-left-color: #ffb11b; background: #fff5e3; padding: 14px 18px; margin: 20px 0; color: #595959;',

      /* ═══ 行内代码 CODE ═══ */
      code: 'color: #9b6e23; background-color: #fff5e3; padding: 3px; font-family: "SF Mono", Consolas, monospace; font-size: 14px;',

      /* ═══ 代码块 PRE ═══ */
      pre: 'background: #2d2a24; color: #e8e4d9; padding: 18px; border-radius: 4px; overflow-x: auto; margin: 20px 0; line-height: 1.6;',

      /* ═══ 无序列表 UL ═══ */
      ul: 'margin-top: 8px; margin-bottom: 8px; padding-left: 25px; color: black; list-style-type: disc;',

      /* ═══ 有序列表 OL ═══ */
      ol: 'margin-top: 8px; margin-bottom: 8px; padding-left: 25px; color: black;',

      /* ═══ 列表项 LI ═══ */
      li: 'margin-top: 5px; margin-bottom: 5px; line-height: 26px; color: black; font-weight: 500;',

      /* ═══ 链接 A ═══ */
      a: 'color: #dda52d; border: none; text-decoration: none;',

      /* ═══ 图片 IMG ═══ */
      // 无圆角、无阴影（原文章特征）
      img: 'width: auto; max-width: 100%; height: auto; display: block; margin-bottom: 15px; box-shadow: none; border-radius: 0;',

      /* ═══ 分割线 HR ═══ */
      hr: 'border: none; border-top: 1px solid #f9bf45; margin: 20px 0;',

      /* ═══ 表格 TABLE ═══ */
      table: 'width: 100%; border-collapse: collapse; margin: 18px 0;',

      /* ═══ 表头 TH ═══ */
      th: 'padding: 11px 14px; border: 1px solid #ddd; text-align: center; font-weight: 600; color: #333;',

      /* ═══ 单元格 TD ═══ */
      td: 'padding: 10px 14px; border: 1px solid #eee; color: #3a3a3a;',

      /* ═══ 扩展样式 ═══ */

      // 加粗：纯黑（原文特征，与正文灰色形成对比）
      strong: 'color: black; font-weight: bold;',

      // 斜体
      em: 'color: #666; font-style: italic;',

      // 删除线
      del: 'color: #d19826; text-decoration: line-through;',

      // 图片说明文字：14px 居中（原文 figcaption 特征）
      figcaption: 'color: #3a3a3a; font-size: 14px; text-align: center; margin: 0 0 20px;',
    },
  },

  // ==================== 暖系杂志风（提取自「阿德记」公众号文章） ====================
  {
    id: 'warm-magazine',
    name: '暖系杂志风',
    description: '提取自「阿德记」公众号文章的暖色调杂志风格，米黄底色 + 衬线标题 + 蓝橙撞色点缀，适合故事、随笔、观点类长文',
    styles: {
      /* ═══ 全局基础：米黄暖底 + 系统无衬线正文字体 ═══ */
      global: {
        fontSize: '15px',
        lineHeight: '1.9',
        color: '#34373a',           // 深炭灰正文
        backgroundColor: '#fffdf8', // 暖米黄底色（原文特征）
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
        containerPadding: '18px 16px',
        themeColor: '#315fae',      // 主题色：杂志蓝
        fontType: 'sans-serif',     // 正文用无衬线，标题用衬线，形成对比
      },

      /* ═══ 衬线字体族（标题/引用专用，下文复用） ═══ */
      // 用 CSS 变量记录衬线字体，便于在 H1~H3、引用中统一引用风格
      // 实际值："Songti SC", STSong, "Noto Serif CJK SC", "Source Han Serif SC", serif

      /* ═══ H1：章节大标题（原文 H2 章节标题 + 顶部分隔线） ═══ */
      // 顶部细分割线 + 衬线大标题，字距收紧，呈现杂志感
      h1: 'margin: 56px 0 22px; padding-top: 19px; border-top: 1px solid #ddd6ca; color: #24282d; font-size: 26px; line-height: 1.4; letter-spacing: -0.02em; font-weight: bold; font-family: "Songti SC", STSong, "Noto Serif CJK SC", "Source Han Serif SC", serif;',

      /* ═══ H2：中号衬线副标题 ═══ */
      h2: 'margin: 32px 0 14px; color: #24282d; font-size: 21px; line-height: 1.45; letter-spacing: -0.01em; font-weight: bold; font-family: "Songti SC", STSong, "Noto Serif CJK SC", "Source Han Serif SC", serif;',

      /* ═══ H3：蓝色竖条标记小标题 ═══ */
      // 左侧蓝色竖条 + 衬线字体，呼应原文强调色
      h3: 'margin: 26px 0 10px; padding-left: 12px; border-left: 3px solid #315fae; color: #263c5e; font-size: 18px; line-height: 1.5; font-weight: bold; font-family: "Songti SC", STSong, "Noto Serif CJK SC", "Source Han Serif SC", serif;',

      /* ═══ 正文段落 P ═══ */
      // 两端对齐、行高 1.9、段后留白 1.15em（原文阅读节奏）
      p: 'margin: 0 0 1.15em; padding: 0; text-align: justify; text-justify: inter-ideograph; color: #34373a; font-size: 15px; line-height: 1.9;',

      /* ═══ 引用块 BLOCKQUOTE（蓝色渐变 pull quote） ═══ */
      // 蓝色左边框 + 蓝米渐变背景 + 衬线粗体引文（原文核心视觉）
      quote: 'margin: 34px 0; padding: 22px 24px; border-left: 4px solid #315fae; background: linear-gradient(135deg, #e8eef8, #f7f4ec); color: #263c5e; font-size: 17px; line-height: 1.75; font-weight: 500; font-family: "Songti SC", STSong, "Noto Serif CJK SC", "Source Han Serif SC", serif;',

      /* ═══ 行内代码 CODE（暖灰底 + 棕红字） ═══ */
      code: 'padding: 2px 6px; background: #f2f0ea; color: #8e412d; border-radius: 3px; font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace; font-size: 14px;',

      /* ═══ 代码块 PRE（暖色调深色底） ═══ */
      pre: 'margin: 20px 0; padding: 18px; background: #2d2a24; color: #e8e4d9; border-radius: 4px; overflow-x: auto; line-height: 1.6; font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;',

      /* ═══ 无序列表 UL ═══ */
      ul: 'margin: 16px 0; padding-left: 26px; color: #34373a; list-style-type: disc;',

      /* ═══ 有序列表 OL ═══ */
      ol: 'margin: 16px 0; padding-left: 26px; color: #34373a; list-style-type: decimal;',

      /* ═══ 列表项 LI ═══ */
      li: 'margin: 6px 0; line-height: 1.9; color: #34373a;',

      /* ═══ 链接 A（杂志蓝 + 细下划线） ═══ */
      a: 'color: #315fae; text-decoration: none; border-bottom: 1px solid rgba(49, 95, 174, 0.3);',

      /* ═══ 图片 IMG（原图无圆角、无阴影，居中展示） ═══ */
      img: 'max-width: 100%; height: auto; display: block; margin: 24px auto; border-radius: 0; box-shadow: none;',

      /* ═══ 分割线 HR（暖灰细线，章节分隔） ═══ */
      hr: 'border: none; border-top: 1px solid #ddd6ca; margin: 48px 0;',

      /* ═══ 表格 TABLE ═══ */
      table: 'width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;',

      /* ═══ 表头 TH（暖灰底 + 深炭字） ═══ */
      th: 'padding: 11px 14px; border: 1px solid #ddd6ca; background: #f2f0ea; text-align: left; font-weight: bold; color: #24282d;',

      /* ═══ 单元格 TD ═══ */
      td: 'padding: 10px 14px; border: 1px solid #e2ddd3; color: #34373a;',

      /* ═══ 扩展样式 ═══ */

      // 加粗：近黑色强调（与正文灰形成对比）
      strong: 'color: #24282d; font-weight: bold;',

      // 斜体：赤陶橙强调（呼应原文 em 的珊瑚色点缀）
      em: 'color: #d86543; font-style: italic;',

      // 删除线：暖灰
      del: 'color: #9a958c; text-decoration: line-through;',

      // 图片说明文字：小号暖灰、居中（原文图注特征）
      figcaption: 'margin: 6px 0 18px; color: #9a958c; font-size: 12px; text-align: center;',
    },
  },
];
