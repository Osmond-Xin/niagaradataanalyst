'use client';

/**
 * 全局导航栏组件
 * Claude 编辑风：羊皮纸底色 + 暖灰文字 + 赤陶 CTA
 * 浅色/暗色模式自动切换背景和边框
 */
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';
import type { NavItem } from '@/types';

/** 导航链接配置 */
const navItems: NavItem[] = [
  { key: 'home', href: '/', translationKey: 'nav.home' },
  { key: 'caseStudy', href: '/case-study', translationKey: 'nav.caseStudy' },
  { key: 'dataAnalysis', href: '/data-analysis', translationKey: 'nav.dataAnalysis' },
  { key: 'architecture', href: '/architecture', translationKey: 'nav.architecture' },
  { key: 'about', href: '/about', translationKey: 'nav.about' },
];

const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /** 判断当前路由是否激活 */
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 bg-parchment/92 dark:bg-near-black/92 backdrop-blur-sm border-b border-border-cream dark:border-border-dark">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo — display 字体，赤陶色 */}
          <Link
            href="/"
            className="font-display font-medium text-lg text-terracotta hover:text-coral transition-colors duration-200"
          >
            {t('nav.logo')}
          </Link>

          {/* 桌面端导航链接 */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`px-3 py-2 rounded-md text-body-sm font-sans transition-colors duration-200
                  ${isActive(item.href)
                    ? 'text-text-primary dark:text-text-heading-dark font-medium'
                    : 'text-text-secondary dark:text-text-on-dark hover:text-text-primary dark:hover:text-text-heading-dark'
                  }`}
              >
                {t(item.translationKey)}
              </Link>
            ))}
            <div className="ml-4">
              <LanguageToggle />
            </div>
          </div>

          {/* 移动端汉堡菜单 */}
          <div className="md:hidden flex items-center space-x-3">
            <LanguageToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-text-secondary dark:text-text-on-dark
                         hover:text-text-primary dark:hover:text-text-heading-dark
                         hover:bg-warm-sand/60 dark:hover:bg-dark-surface
                         focus:outline-none focus:ring-2 focus:ring-focus-blue"
              aria-label="菜单"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 移动端展开菜单 */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border-cream dark:border-border-dark bg-parchment/98 dark:bg-near-black/98 backdrop-blur-sm">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-body font-sans transition-colors duration-200
                  ${isActive(item.href)
                    ? 'text-text-primary dark:text-text-heading-dark font-medium bg-warm-sand/50 dark:bg-dark-surface'
                    : 'text-text-secondary dark:text-text-on-dark hover:text-text-primary dark:hover:text-text-heading-dark hover:bg-warm-sand/30 dark:hover:bg-dark-surface/50'
                  }`}
              >
                {t(item.translationKey)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
