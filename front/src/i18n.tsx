import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import translationEnglish from "./translation/English/translation.json";
import translationPolish from "./translation/Polish/translation.json";

const savedLanguage = localStorage.getItem("language") || "pl-PL";

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
  lng: savedLanguage,
  fallbackLng: "pl-PL",
  interpolation: {
    escapeValue: false,
  },
});

i18next.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);
});

export default i18next;
