export function useClipboard() {
  const copyWeChatHTML = async (element: HTMLElement): Promise<boolean> => {
    try {
      // 需要复制的样式属性列表
      const styleKeys = [
        'color', 'font-size', 'line-height', 'font-weight', 'background-color',
        'text-align', 'margin', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right',
        'padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right',
        'border', 'border-left', 'border-right', 'border-top', 'border-bottom',
        'border-radius', 'box-shadow', 'max-width', 'display', 'text-decoration',
        'font-style', 'letter-spacing', 'overflow-x', 'font-family', 'list-style',
        'list-style-type', 'text-indent', 'white-space', 'word-wrap', 'word-break'
      ];

      // 直接从原始元素获取计算样式
      // 因为原始元素已经在 DOM 中，样式已经正确应用
      const allElements = [element, ...Array.from(element.querySelectorAll('*'))];
      
      // 存储每个元素的计算样式
      const computedStyles = new Map<Element, string>();
      
      allElements.forEach(el => {
        const computed = window.getComputedStyle(el);
        let styleString = '';

        styleKeys.forEach(key => {
          const value = computed.getPropertyValue(key);
          if (value && value !== 'none' && value !== 'normal' && value !== '0px' && value !== '' && value !== 'auto') {
            styleString += `${key}:${value};`;
          }
        });

        computedStyles.set(el, styleString);
      });

      // 克隆元素
      const clone = element.cloneNode(true) as HTMLElement;

      // 获取克隆后的所有元素（包括根元素）
      const cloneElements = [clone, ...Array.from(clone.querySelectorAll('*'))];

      // 将计算好的样式应用到克隆的元素上
      cloneElements.forEach((el, index) => {
        const originalEl = allElements[index];
        if (!originalEl) return;
        const styleString = computedStyles.get(originalEl) || '';

        if (styleString) {
          el.setAttribute('style', styleString);
        }
        el.removeAttribute('class');
        el.removeAttribute('id');
      });

      // 获取处理后的 HTML
      const html = clone.outerHTML;
      const plainText = clone.textContent || '';

      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
        const blobHTML = new Blob([html], { type: 'text/html' });
        const blobText = new Blob([plainText], { type: 'text/plain' });

        const item = new ClipboardItem({
          'text/html': blobHTML,
          'text/plain': blobText,
        });

        await navigator.clipboard.write([item]);
        return true;
      }

      return fallbackCopy(html, plainText);
    } catch (error) {
      console.error('Copy failed:', error);
      return false;
    }
  };

  const fallbackCopy = (html: string, _plainText: string): boolean => {
    try {
      const container = document.createElement('div');
      container.innerHTML = html;
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.setAttribute('contenteditable', 'true');
      document.body.appendChild(container);

      const range = document.createRange();
      range.selectNodeContents(container);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
        selection.removeAllRanges();
      }

      document.body.removeChild(container);
      return true;
    } catch (error) {
      console.error('Fallback copy failed:', error);
      return false;
    }
  };

  return {
    copyWeChatHTML,
  };
}
