'use client';

/**
 * 语言上下文提供者
 * 管理全局语言状态，提供翻译函数和语言切换功能
 * 使用localStorage持久化语言偏好
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '@/data/translations';
import type { Language, LanguageContextType } from '@/types';

/** 默认语言上下文值 */
const LanguageContext = createContext<LanguageContextType>({
  language: 'zh',
  setLanguage: () => {},
  t: (key: string) => key,
});

/** localStorage存储键 */
const LANGUAGE_STORAGE_KEY = 'nda-language';

/**
 * 通过点分隔路径访问嵌套对象
 * 例如: getNestedValue(obj, 'nav.home') => obj.nav.home
 */
function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return path;
    }
    current = (current as Record<string, unknown>)[key];
  }

  if (typeof current === 'string') {
    return current;
  }

  return path;
}

/**
 * 语言提供者组件
 * 包裹整个应用，提供语言状态和翻译功能
 */
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('zh');
  const [mounted, setMounted] = useState(false);

  /** 初始化：从localStorage读取语言偏好 */
  useEffect(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === 'en' || saved === 'zh') {
      setLanguageState(saved);
    }
    setMounted(true);
  }, []);

  /** 更新html lang属性 */
  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = language;
    }
  }, [language, mounted]);

  /** 切换语言并持久化 */
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  }, []);

  /** 翻译函数：通过键获取当前语言的翻译文本 */
  const t = useCallback((key: string): string => {
    const langData = translations[language];
    if (!langData) {
      console.warn(`[i18n] 语言数据不存在: ${language}`);
      return key;
    }

    const value = getNestedValue(langData as unknown as Record<string, unknown>, key);
    if (value === key) {
      console.warn(`[i18n] 翻译键缺失: ${key} (${language})`);
    }
    return value;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * 语言Hook
 * 在组件中使用以获取语言状态和翻译函数
 */
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage必须在LanguageProvider内部使用');
  }
  return context;
};
