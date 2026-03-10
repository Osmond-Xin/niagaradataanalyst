/**
 * GA4 脚本加载组件
 * 在根布局中引入，负责加载 Google Analytics 4 脚本
 * 使用 afterInteractive 策略确保不阻塞页面渲染
 */
import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const GoogleAnalytics: React.FC = () => {
  if (!GA_ID) return null;

  return (
    <>
      {/* 加载 gtag.js 主脚本 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      {/* 初始化 GA4 配置 */}
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            send_page_view: true
          });
        `}
      </Script>
    </>
  );
};

export default GoogleAnalytics;
