(function() {
  if (window.DuaI18n?.ready) {
    window.DuaI18n.init?.();
    return;
  }
  const SUPPORTED_LANGS = [ "en", "sq", "fr", "it", "de" ];
  const DEFAULT_LANG = "en";
  const LOCALES_BASE = "/assets/lang";
  const LOCALE_FILE_PATTERN = "{{lng}}_lang.json";
  function getInitialLang() {
    const stored = localStorage.getItem("lang");
    if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
    const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    return SUPPORTED_LANGS.includes(nav) ? nav : DEFAULT_LANG;
  }
  const readyPromise = new Promise(resolveReady => {
    function boot() {
      if (!window.i18next) {
        setTimeout(boot, 30);
        return;
      }
      const initialLang = getInitialLang();
      const plugins = window.i18nextHttpBackend ? [ window.i18nextHttpBackend ] : [];
      let chain = window.i18next;
      plugins.forEach(p => {
        chain = chain.use(p);
      });
      chain.init({
        lng: initialLang,
        fallbackLng: DEFAULT_LANG,
        supportedLngs: SUPPORTED_LANGS,
        ns: [ "translation" ],
        defaultNS: "translation",
        load: "languageOnly",
        debug: false,
        interpolation: {
          escapeValue: false
        },
        returnEmptyString: false,
        backend: window.i18nextHttpBackend ? {
          loadPath: `${LOCALES_BASE}/${LOCALE_FILE_PATTERN}`
        } : undefined
      }, () => {
        resolveReady();
      });
    }
    boot();
  });
  async function ensureResourcesLoaded() {
    if (window.i18next?.options?.backend) return;
    if (window.i18next?.hasResourceBundle?.(getInitialLang(), "translation")) return;
    // Load resources for all supported languages except DEFAULT_LANG (English)
    const langsToLoad = SUPPORTED_LANGS.filter(l => l !== DEFAULT_LANG);
    const results = await Promise.all(langsToLoad.map(lang => fetch(`${LOCALES_BASE}/${lang}_lang.json`).then(r => r.ok ? r.json() : {}).catch(() => ({}))));
    langsToLoad.forEach((lang, i) => {
      window.i18next.addResourceBundle(lang, "translation", results[i], true, true);
    });
  }
  const listeners = new Set;
  function dispatchLanguageChanged(lang) {
    document.dispatchEvent(new CustomEvent("languageChanged", {
      detail: {
        lang: lang
      }
    }));
    listeners.forEach(fn => {
      try {
        fn(lang);
      } catch (e) {}
    });
  }
  function t(key, options) {
    if (!window.i18next?.isInitialized) return undefined;
    const lang = window.i18next.language;
    if (lang === DEFAULT_LANG) return undefined;
    const val = window.i18next.t(key, options);
    if (!val || val === key) return undefined;
    return val;
  }
  function getHtmlFallback(el, key) {
    if (!el) return key;
    if (el.hasAttribute("data-i18n-original")) return el.getAttribute("data-i18n-original");
    const original = el.textContent || "";
    el.setAttribute("data-i18n-original", original);
    return original;
  }
  function tv(namespace, code) {
    if (!code) return undefined;
    if (!window.i18next?.isInitialized) return undefined;
    const lang = window.i18next.language;
    if (lang === DEFAULT_LANG) return undefined;
    const key = `${namespace}.${code}`;
    const val = window.i18next.t(key, {
      defaultValue: ""
    });
    return val || undefined;
  }
  function plural(unit, count) {
    if (!window.i18next?.isInitialized) return undefined;
    const lang = window.i18next.language;
    if (lang === DEFAULT_LANG) return undefined;
    // Try i18next plural key first
    const label = window.i18next.t(`plurals.${unit}`, {
      count: Number(count) || 0,
    });
    if (label && label !== `plurals.${unit}`) {
      return `${count} ${label}`;
    }
    // Fallback to flat keys like plurals.unit_one / plurals.unit_other
    const one = window.i18next.t(`plurals.${unit}_one`) || "";
    const other = window.i18next.t(`plurals.${unit}_other`) || "";
    const n = Number(count) || 0;
    if (n === 1 && one) return `${count} ${one}`;
    if (other) return `${count} ${other}`;
    return `${count} ${unit}`;
  }
  function currentLang() {
    return window.i18next?.language || DEFAULT_LANG;
  }
  function translateNode(root) {
    if (!window.i18next?.isInitialized) return;
    const scope = root || document;
    const lang = currentLang();
    if (lang === DEFAULT_LANG) {
      scope.querySelectorAll?.("[data-i18n]").forEach(el => {
        const original = el.getAttribute("data-i18n-original");
        if (original !== null) el.textContent = original;
      });
      return;
    }
    scope.querySelectorAll?.("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      if (!el.hasAttribute("data-i18n-original")) {
        el.setAttribute("data-i18n-original", el.textContent || "");
      }
      const val = t(key);
      if (val !== undefined && val !== null && val !== key) {
        el.textContent = val;
      }
    });
    scope.querySelectorAll?.("[data-i18n-attr]").forEach(el => {
      const spec = el.getAttribute("data-i18n-attr");
      if (!spec) return;
      spec.split(";").forEach(pair => {
        const [attr, key] = pair.split(":").map(s => s.trim());
        if (!attr || !key) return;
        const val = t(key);
        if (val && val !== key) el.setAttribute(attr, val);
      });
    });
  }
  function translatePage() {
    translateNode(document);
  }
  async function setLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    await ensureResourcesLoaded();
    await window.i18next.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    document.documentElement.setAttribute("lang", lang);
    translatePage();
    dispatchLanguageChanged(lang);
  }
  function onLanguageChanged(fn) {
    if (typeof fn === "function") listeners.add(fn);
  }
  function wireLangSelect() {
    const select = document.getElementById("langSelect");
    if (!select) return;
    select.value = currentLang();
    select.addEventListener("change", e => {
      setLanguage(e.target.value);
    });
  }
  async function init() {
    await readyPromise;
    await ensureResourcesLoaded();
    document.documentElement.setAttribute("lang", currentLang());
    wireLangSelect();
    translatePage();
    dispatchLanguageChanged(currentLang());
  }
  window.DuaI18n = {
    ready: true,
    SUPPORTED_LANGS: SUPPORTED_LANGS,
    DEFAULT_LANG: DEFAULT_LANG,
    init: init,
    t: t,
    tv: tv,
    plural: plural,
    getLang: currentLang,
    setLanguage: setLanguage,
    translatePage: translatePage,
    translateNode: translateNode,
    onLanguageChanged: onLanguageChanged
  };
  Object.defineProperty(window.DuaI18n, "lang", {
    get: currentLang
  });
  window.addEventListener("partialsLoaded", init);
  document.addEventListener("DOMContentLoaded", init, {
    once: true
  });
  init();
})();
