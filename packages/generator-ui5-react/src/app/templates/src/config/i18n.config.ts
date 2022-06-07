import { I18nModuleRegistryOptions } from "@cpro-js/react-core";

const FALLBACK_LOCALE = "<%= defaultLocale %>";

export const createI18nConfig = (locale?: string): I18nModuleRegistryOptions => ({
  debug: false,
  fallbackLocale: FALLBACK_LOCALE,
  getTranslations: localeToLoad => import(`../asset/locale/${localeToLoad}.i18n.json`),
  // when integrated into launchpad, then launchpad will provide locale
  // when standalone, then behave as Fiori by supporting query string & browser setting
  localeResolver: locale ?? {
    order: ["querystring", "navigator"],
    lookupQuerystring: "sap-language",
  },
  // specify all maintained translations, i.e. files existing in asset/locale,
  // e.g. ["en", "en-GB", "de"] if you have en.i18n.json, en-GB.i18n.json & de.i18n.json
  maintainedTranslations: [FALLBACK_LOCALE],
  // restrict locale to be used for formatting
  // supportedFormattingLocales: ["en-*"],
});
