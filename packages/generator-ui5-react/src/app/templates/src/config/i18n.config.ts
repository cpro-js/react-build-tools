import { I18nModuleRegistryOptions } from "@cpro-js/react-core";

const FALLBACK_LOCALE = "<%= defaultLocale %>";

export const createI18nConfig = (locale: string): I18nModuleRegistryOptions => ({
  debug: true,
  determineLocale: () => locale,
  fallbackLocale: FALLBACK_LOCALE,
  supportedLocales: [FALLBACK_LOCALE],
  getTranslations: language => import(`../asset/locale/${language}.i18n.json`),
});
