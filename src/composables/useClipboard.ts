export function useClipboard() {
  const copyWeChatHTML = async (element: HTMLElement): Promise<boolean> => {
    try {
      const clone = element.cloneNode(true) as HTMLElement;

      const allElements = clone.querySelectorAll('*');
      const styleKeys = [
        'color', 'font-size', 'line-height', 'font-weight', 'background-color',
        'text-align', 'margin', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right',
        'padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right',
        'border', 'border-left', 'border-right', 'border-top', 'border-bottom',
        'border-radius', 'box-shadow', 'max-width', 'display', 'text-decoration',
        'font-style', 'letter-spacing', 'overflow-x', 'font-family'
      ];

      allElements.forEach(el => {
        const computed = window.getComputedStyle(el);
        let styleString = '';

        styleKeys.forEach(key => {
          const value = computed.getPropertyValue(key);
          if (value && value !== 'none' && value !== 'normal' && value !== '0px') {
            styleString += `${key}:${value};`;
          }
        });

        if (styleString) {
          el.setAttribute('style', styleString);
        }
        el.removeAttribute('class');
        el.removeAttribute('id');
      });

      const html = clone.innerHTML;
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
