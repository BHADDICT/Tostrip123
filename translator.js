/* ============================================================
   TosTrip — translator.js
   Reads window.translations (from translations.js) and applies
   them to any element carrying a data-i18n* attribute.
   ============================================================ */
(function () {

  /* ── Core lookup ─────────────────────────────────────────── */
  function t(key, lang) {
    lang = lang || localStorage.getItem('lang') || 'en';
    if (!window.translations) return key;
    var d = translations[lang] || translations.en;
    var v = d[key];
    if (v === undefined) v = (translations.en || {})[key];
    return v !== undefined ? v : key;
  }
  window.t = t;   // expose so inline scripts can call t('key')

  /* ── Apply all data-i18n* attributes ─────────────────────── */
  function applyLang(lang) {
    lang = lang || localStorage.getItem('lang') || 'en';

    /* data-i18n  →  el.textContent */
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n'), lang);
      el.textContent = v;
    });

    /* data-i18n-html  →  el.innerHTML  (newlines → <br>) */
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-html'), lang);
      el.innerHTML = v.replace(/\n/g, '<br>');
    });

    /* data-i18n-ph  →  el.placeholder */
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-ph'), lang);
      el.placeholder = v;
    });

    /* Update <html lang="…"> */
    document.documentElement.lang = lang;
  }
  window.applyLang = applyLang;

  /* ── Auto-apply on DOM ready ─────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    var saved  = localStorage.getItem('lang') || 'en';
    var labels = { en: 'English', fr: 'Français', km: 'ខ្មែរ' };

    applyLang(saved);

    /* Restore language button label */
    var btn = document.getElementById('langBtn');
    if (btn && labels[saved]) {
      btn.innerHTML =
        '<i class="fas fa-globe"></i> ' + labels[saved] +
        ' <i class="fas fa-chevron-down" style="font-size:10px"></i>';
    }

    /* Seed the chatbot welcome bubble with the right language */
    var welcome = document.getElementById('botWelcomeBubble');
    if (welcome) welcome.innerHTML = t('bot.welcome', saved);
    var botLbl = document.getElementById('botWelcomeLabel');
    if (botLbl) botLbl.textContent = t('bot.lbl', saved);
  });

})();