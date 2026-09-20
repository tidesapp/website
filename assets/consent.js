/**
 * Cookie consent gate for Google Analytics.
 *
 * - If the visitor has already allowed analytics, assets/analytics.js
 *   is loaded. Otherwise the analytics code is never loaded at all.
 * - A consent banner is shown at the top of the screen on first visit.
 * - The choice is stored in localStorage and can be changed at any time
 *   via the "Cookie preferences" link added to the footer.
 */
(function () {
  var KEY = 'tides-cookie-consent';

  function getChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function setChoice(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
  }

  function loadAnalytics() {
    if (document.querySelector('script[src="assets/analytics.js"]')) return;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'assets/analytics.js';
    document.head.appendChild(s);
  }

  // "Cookie preferences" link so the choice can be changed at any time.
  var prefs = document.createElement('a');
  prefs.href = '#';
  prefs.className = 'cookie-prefs';
  prefs.textContent = 'Cookie preferences';

  var footerNav = document.querySelector('footer nav');
  if (footerNav) {
    var sep = document.createElement('span');
    sep.setAttribute('aria-hidden', 'true');
    sep.textContent = '·';
    footerNav.appendChild(sep);
    footerNav.appendChild(prefs);
  } else {
    var footer = document.querySelector('footer') || document.body;
    footer.appendChild(prefs);
  }

  var banner = null;

  function buildBanner() {
    var b = document.createElement('div');
    b.className = 'consent-banner';
    b.setAttribute('role', 'region');
    b.setAttribute('aria-label', 'Cookie consent');
    b.innerHTML =
      '<div class="glass-card consent-inner">' +
        '<div class="flex min-w-0 flex-1 items-start gap-3 sm:items-center">' +
          '<span class="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-tide-50 text-tide-700 sm:mt-0 dark:bg-tide-500/15 dark:text-tide-400">' +
            '<svg class="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
              '<path d="M2 13c2.7-5.5 5.3-5.5 8 0s5.3 5.5 8 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
            '</svg>' +
          '</span>' +
          '<p class="consent-text">We use <a href="privacy#analytics">Google&nbsp;Analytics</a> to collect ' +
          'anonymous usage statistics for this website. The app itself collects no ' +
          'data. Your choice is stored on this device only.</p>' +
        '</div>' +
        '<div class="flex flex-col gap-2 sm:flex-row sm:shrink-0">' +
          '<button type="button" class="btn btn-primary" data-choice="granted">Allow analytics</button>' +
          '<button type="button" class="btn btn-ghost" data-choice="denied">Don&#39;t allow</button>' +
        '</div>' +
      '</div>';

    b.querySelectorAll('button[data-choice]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setChoice(btn.getAttribute('data-choice'));
        if (btn.getAttribute('data-choice') === 'granted') loadAnalytics();
        b.remove();
        banner = null;
      });
    });

    var firstButton = b.querySelector('button');
    if (firstButton) firstButton.focus();
    return b;
  }

  function showBanner() {
    if (!banner || !banner.isConnected) {
      banner = buildBanner();
      document.body.appendChild(banner);
    }
  }

  prefs.addEventListener('click', function (e) {
    e.preventDefault();
    showBanner();
  });

  if (getChoice() !== 'granted') {
    showBanner();
  } else {
    loadAnalytics();
  }
})();
