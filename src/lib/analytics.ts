/**
 * 统一埋点工具函数
 * 所有GA4事件通过此模块发送，禁止在组件中直接调用 window.gtag
 */

// 声明全局 gtag 类型
declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'js' | 'set',
      targetId: string,
      config?: Record<string, string | number | boolean>
    ) => void;
    dataLayer: unknown[];
  }
}

/**
 * 基础事件追踪函数
 * 在服务端、gtag未加载或无测量ID时静默忽略
 */
export const trackEvent = (
  eventName: string,
  params?: Record<string, string | number | boolean>
): void => {
  if (typeof window === 'undefined') return;
  if (!window.gtag) return;
  if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) return;
  window.gtag('event', eventName, params);
};

/**
 * P0 转化核心 + P1 用户意图事件集合
 * 按优先级分组，参数类型严格定义避免拼写错误
 */
export const analytics = {
  // ─── P0 转化核心 ───────────────────────────────────────

  /** 联系方式点击：邮件/LinkedIn/GitHub等 */
  contactClick: (
    contactType: 'email' | 'linkedin' | 'github' | string,
    currentLang: string,
    previousSection?: string
  ) =>
    trackEvent('contact_click', {
      contact_type: contactType,
      current_lang: currentLang,
      ...(previousSection && { previous_section: previousSection }),
    }),

  /** 简历下载 */
  resumeDownload: (
    lang: 'zh' | 'en',
    currentLang: string,
    previousSection?: string
  ) =>
    trackEvent('resume_download', {
      lang,
      current_lang: currentLang,
      ...(previousSection && { previous_section: previousSection }),
    }),

  /** 语言切换 */
  languageToggle: (fromLang: 'zh' | 'en', toLang: 'zh' | 'en') =>
    trackEvent('language_toggle', { from_lang: fromLang, to_lang: toLang }),

  /** 聊天窗口打开 */
  chatSessionStart: (sessionId: string, currentLang: string) =>
    trackEvent('chat_session_start', {
      session_id: sessionId,
      current_lang: currentLang,
    }),

  /** 用户发送一条消息 */
  chatMessageSent: (sessionId: string, messageIndex: number) =>
    trackEvent('chat_message_sent', {
      session_id: sessionId,
      message_index: messageIndex,
    }),

  /** 聊天会话结束 */
  chatSessionEnd: (
    sessionId: string,
    totalMessages: number,
    durationSec: number
  ) =>
    trackEvent('chat_session_end', {
      session_id: sessionId,
      total_messages: totalMessages,
      duration_sec: durationSec,
    }),

  /** 打开聊天但未发任何消息即关闭（放弃信号） */
  chatOpenedNoMessage: (sessionId: string, currentLang: string) =>
    trackEvent('chat_opened_no_message', {
      session_id: sessionId,
      current_lang: currentLang,
    }),

  /** 聊天后15分钟内发生联系行为（AI转化归因） */
  chatThenContact: (sessionId: string, chatMessagesCount: number) =>
    trackEvent('chat_then_contact', {
      session_id: sessionId,
      chat_messages_count: chatMessagesCount,
    }),

  // ─── P1 用户意图 ────────────────────────────────────────

  /** 项目卡片点击 */
  projectClick: (projectName: string, currentLang: string) =>
    trackEvent('project_click', {
      project_name: projectName,
      current_lang: currentLang,
    }),

  /** 行动按钮点击 */
  ctaClick: (ctaText: string, ctaLocation: string, currentLang: string) =>
    trackEvent('cta_click', {
      cta_text: ctaText,
      cta_location: ctaLocation,
      current_lang: currentLang,
    }),

  /** 外部链接点击 */
  externalLinkClick: (linkUrl: string, linkText: string) =>
    trackEvent('external_link_click', {
      link_url: linkUrl,
      link_text: linkText,
    }),

  /** GitHub链接点击（高意图信号） */
  githubLinkClick: (projectName: string) =>
    trackEvent('github_link_click', { project_name: projectName }),

  // ─── 联系表单事件 ────────────────────────────────────────

  /** 联系表单展示（区分触发来源：button = 常驻按钮 / ai = AI 智能触发） */
  contactFormShown: (trigger: 'button' | 'ai', sessionId: string) =>
    trackEvent('contact_form_shown', { trigger, session_id: sessionId }),

  /** 联系表单成功提交 */
  contactFormSubmitted: (sessionId: string) =>
    trackEvent('contact_form_submitted', { session_id: sessionId }),

  /** 联系表单提交失败 */
  contactFormError: (sessionId: string) =>
    trackEvent('contact_form_error', { session_id: sessionId }),
};
