/**
 * Cookie consent gate for Google Analytics.
 *
 * - If the visitor has already allowed analytics, assets/analytics.js
 *   is loaded. Otherwise the analytics code is never loaded at all.
 * - The choice is stored in localStorage and can be changed at any time
 *   via the "Cookie preferences" link added to the page footer.
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

  var footer = document.querySelector('footer');
  if (footer) {
    footer.insertBefore(prefs, footer.firstChild);
  } else {
    var p = document.createElement('p');
    p.className = 'muted small';
    p.appendChild(prefs);
    document.body.appendChild(p);
  }

  prefs.addEventListener('click', function (e) {
    e.preventDefault();
    showBanner();
  });

  if (getChoice() === 'granted') {
    loadAnalytics();
    return;
  }

  var banner = document.createElement('div');
  banner.id = 'consent-banner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Cookie consent');
  banner.innerHTML =
    '<p>We use <a href="privacy#analytics">Google&nbsp;Analytics</a> to collect ' +
    'anonymous usage statistics for this website. The app itself collects ' +
    'no data. Your choice is stored on this device only.</p>' +
    '<div class="actions">' +
    '<button type="button" data-choice="granted">Allow analytics</button>' +
    '<button type="button" class="secondary" data-choice="denied">Don&#39;t allow</button>' +
    '</div>';
  document.body.appendChild(banner);

  function showBanner() {
    if (!banner.isConnected) document.body.appendChild(banner);
  }

  banner.querySelectorAll('button[data-choice]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setChoice(btn.getAttribute('data-choice'));
      if (btn.getAttribute('data-choice') === 'granted') loadAnalytics();
      banner.remove();
    });
  });

  var firstButton = banner.querySelector('button');
  if (firstButton) firstButton.focus();
})();
