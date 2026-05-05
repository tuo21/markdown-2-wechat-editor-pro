export interface StyleProperties {
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  margin?: string;
  padding?: string;
  backgroundColor?: string;
  border?: string;
  borderRadius?: string;
  fontFamily?: string;
  textDecoration?: string;
  letterSpacing?: string;
  textAlign?: string;
  borderLeft?: string;
  borderBottom?: string;
  overflowX?: string;
  display?: string;
  maxWidth?: string;
  height?: string;
  boxShadow?: string;
  borderCollapse?: string;
  [key: string]: string | undefined;
}

export interface GlobalStyle {
  fontSize: string;
  lineHeight: string;
  color: string;
  backgroundColor: string;
  fontFamily: string;
  containerPadding?: string;    // 容器内边距，如 "25px 8px"
  themeColor?: string;           // 主题色，统一控制装饰性色彩（边框、强调等），可被各元素单独覆盖
  fontType?: 'serif' | 'sans-serif'; // 字体类型：衬线体 / 非衬线体
}

export interface Theme {
  id: string;
  name: string;
  description?: string;           // 主题描述（可选）
  isCustom?: boolean;
  styles: {
    global: GlobalStyle;
    h1: string | StyleProperties;
    h2: string | StyleProperties;
    h3: string | StyleProperties;
    p: string | StyleProperties;
    quote: string | StyleProperties;
    code: string | StyleProperties;
    pre: string | StyleProperties;
    ul: string | StyleProperties;
    ol: string | StyleProperties;
    li: string | StyleProperties;
    a: string | StyleProperties;
    img: string | StyleProperties;
    hr: string | StyleProperties;
    table: string | StyleProperties;
    th: string | StyleProperties;
    td: string | StyleProperties;
    /* 扩展样式（微信编辑器常用） */
    strong?: string;              // 加粗
    em?: string;                  // 斜体
    del?: string;                 // 删除线
    figcaption?: string;          // 图片说明文字
  };
}

export interface EditorState {
  contentMarkdown: string;
  currentThemeId: string;
  customThemes: Theme[];
}

export function isTheme(value: unknown): value is Theme {
  if (typeof value !== 'object' || value === null) return false;
  const theme = value as Record<string, unknown>;
  return (
    typeof theme.id === 'string' &&
    typeof theme.name === 'string' &&
    typeof theme.styles === 'object' &&
    theme.styles !== null
  );
}

export function isThemeArray(value: unknown): value is Theme[] {
  return Array.isArray(value) && value.every(isTheme);
}
