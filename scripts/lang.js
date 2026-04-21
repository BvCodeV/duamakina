const urlLang = location.pathname.startsWith('/sq') ? 'sq'
              : location.pathname.startsWith('/it') ? 'it'
              : 'en';

const storedLang = localStorage.getItem('lang') || 'en';

if (storedLang !== urlLang) {
  const page = location.pathname.replace(/^\/(sq|it)\//, '/');
  location.replace(storedLang === 'en' ? page : '/' + storedLang + page);
}

function getCurrentPagePath() {
  return location.pathname.replace(/^\/(sq|it)\//, '/');
}

function switchLang(lang) {
  localStorage.setItem('lang', lang);
  const page = getCurrentPagePath();
  location.href = lang === 'en' ? page : '/' + lang + page;
}

function initLangSelect() {
  const sel = document.getElementById('langSelect');
  if (!sel) return;
  sel.value = urlLang;
  sel.addEventListener('change', e => switchLang(e.target.value));
}

function langHref(path) {
  const lang = localStorage.getItem('lang') || 'en';
  return lang === 'en' ? path : '/' + lang + path;
}

window.addEventListener('partialsLoaded', initLangSelect);