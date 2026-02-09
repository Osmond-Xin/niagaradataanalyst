'use client';

/**
 * 全局导航栏组件
 * 包含Logo、5个导航链接、语言切换按钮和移动端汉堡菜单
 * 在所有页面上保持可见
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

  /** 判断导航链接是否为当前活动页面 */
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent
                       hover:from-blue-300 hover:to-cyan-300 transition-all duration-300"
          >
            {t('nav.logo')}
          </Link>

          {/* 桌面端导航链接 */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                  ${isActive(item.href)
                    ? 'text-blue-400 bg-gray-800/50'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/30'
                  }`}
              >
                {t(item.translationKey)}
              </Link>
            ))}
            <div className="ml-4">
              <LanguageToggle />
            </div>
          </div>

          {/* 移动端汉堡菜单按钮 */}
          <div className="md:hidden flex items-center space-x-3">
            <LanguageToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="菜单"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                /* X图标 */
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                /* 汉堡图标 */
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 移动端展开菜单 */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-950/95 backdrop-blur-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
                  ${isActive(item.href)
                    ? 'text-blue-400 bg-gray-800/50'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/30'
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
