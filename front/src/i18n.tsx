import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import translationEnglish from "./translation/English/translation.json";
import translationPolish from "./translation/Polish/translation.json";

const getLangFromCookie = () => {
  const match = document.cookie.match(new RegExp('(^| )vite-ui-lang=([^;]+)'));
  if (match) return match[2];
  return null;
};

const savedLanguage = getLangFromCookie() || localStorage.getItem("language") || "pl";
const normalizedLang = savedLanguage.startsWith("pl") ? "pl" : "en";

const resources = {
  en: {
    translation: translationEnglish,
  },
  pl: {
    translation: translationPolish,
  },
};

i18next.use(initReactI18next).init({
  resources,
  lng: normalizedLang,
  fallbackLng: "pl",
  interpolation: {
    escapeValue: false,
  },
});

i18next.on("languageChanged", (lng) => {
  const newLang = lng.startsWith("pl") ? "pl" : "en";
  localStorage.setItem("language", newLang);
  document.cookie = `vite-ui-lang=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
});

export default i18next;