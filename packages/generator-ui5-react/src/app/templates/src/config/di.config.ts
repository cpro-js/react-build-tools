import { Container, I18nService, createI18nModuleRegistry } from "@cpro-js/react-core";
import { createNotificationRegistry } from "@cpro-js/react-ui5-notification";
// @ts-ignore: no typings available
import { setLanguage } from "@ui5/webcomponents-base/dist/config/Language";

import { AppODataService } from "../odata/AppODataService";
import { createI18nConfig } from "./i18n.config";
import { createODataConfig } from "./odata.config";

/**
 * Create the DI container
 * @param options
 */
export const createContainer = async (options: {
  locale?: string;
  resolveUri: (path: string) => string;
}): Promise<Container> => {
  // the Dependency Injection container
  const container = new Container();

  // initialize I18nService
  await container.loadAsync(createI18nModuleRegistry(createI18nConfig(options.locale)));
  const i18nService = container.get(I18nService);
  setLanguage(i18nService.getTranslationLocale());

  // initialize NotificationService
  await container.loadAsync(createNotificationRegistry());

  // initialize ODataService
  const odataConfig = createODataConfig(i18nService.getTranslationLocale(), options.resolveUri);
  container.bindConstant(AppODataService, new AppODataService(odataConfig));

  return container;
};
