import type { StyleProperties } from '../types';

export function parseCSSString(css: string): StyleProperties {
  const styles: StyleProperties = {};
  if (!css) return styles;
  
  const declarations = css.split(';').filter(d => d.trim());
  declarations.forEach(decl => {
    const [key, value] = decl.split(':').map(s => s.trim());
    if (key && value) {
      const camelCaseKey = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      styles[camelCaseKey] = value;
    }
  });
  
  return styles;
}

export function toCSSString(styles: StyleProperties): string {
  if (!styles) return '';
  
  return Object.entries(styles)
    .filter(([_, value]) => value)
    .map(([key, value]) => {
      const kebabCaseKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${kebabCaseKey}: ${value}`;
    })
    .join('; ');
}

export function ensureCSSString(style: string | StyleProperties): string {
  if (typeof style === 'string') return style;
  return toCSSString(style);
}

export function ensureStyleProperties(style: string | StyleProperties): StyleProperties {
  if (typeof style === 'string') return parseCSSString(style);
  return style;
}
