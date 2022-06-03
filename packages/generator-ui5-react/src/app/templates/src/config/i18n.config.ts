import { I18nModuleRegistryOptions } from "@cpro-js/react-core";

const FALLBACK_LOCALE = "<%= defaultLocale %>";

export const createI18nConfig = (locale: string): I18nModuleRegistryOptions => ({
  debug: true,
  determineLocale: (supportedLocales, fallbackLocale) => {
    if (supportedLocales.includes(locale)) {
      return locale;
    }
    if (/-/.test(locale)) {
      const lang = locale.split("-")[0];
      if (supportedLocales.includes(lang)) {
        return lang;
      }
    }
    return fallbackLocale;
  },
  fallbackLocale: FALLBACK_LOCALE,
  supportedLocales: [FALLBACK_LOCALE],
  getTranslations: language => import(`../asset/locale/${language}.i18n.json`),
});
