import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';

const md = MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
});

export function useMarkdown() {
  const renderMarkdown = (markdown: string): string => {
    const html = md.render(markdown);
    return DOMPurify.sanitize(html, {
      ADD_TAGS: ['section'],
      ADD_ATTR: ['data-*', 'class', 'style'],
    });
  };

  return {
    renderMarkdown,
  };
}
