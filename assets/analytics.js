/**
 * Google Analytics (gtag.js) — loaded by every page.
 * The measurement ID lives in this file only.
 */
(function () {
  var GA_ID = 'G-RXFLLXBD1N';

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_ID);

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
})();
