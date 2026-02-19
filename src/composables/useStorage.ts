const STORAGE_KEYS = {
  CONTENT: 'wechat_editor_content',
  THEMES: 'wechat_editor_themes',
  CURRENT_THEME_ID: 'wechat_editor_current_theme_id',
  DARK_MODE: 'wechat_editor_dark_mode',
};

export function useStorage() {
  const get = <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const set = (key: string, value: unknown): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error('Failed to save to localStorage');
    }
  };

  const remove = (key: string): void => {
    localStorage.removeItem(key);
  };

  return {
    STORAGE_KEYS,
    get,
    set,
    remove,
  };
}
