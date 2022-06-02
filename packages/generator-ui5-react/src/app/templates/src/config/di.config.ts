import { Container, I18nService, createI18nModuleRegistry } from "@cpro-js/react-core";
import { createNotificationRegistry } from "@cpro-js/react-ui5-notification";

import { createI18nConfig } from "./i18n.config";

// import { createODataConfig } from "./odata.config";

/**
 * Create the DI container
 * @param options
 */
export const createContainer = async (options: {
  locale: string;
  resolveUri: (path: string) => string;
}): Promise<Container> => {
  // the Dependency Injection container
  const container = new Container();

  // initialize I18nService
  await container.loadAsync(createI18nModuleRegistry(createI18nConfig(options.locale)));
  // initialize NotificationService
  await container.loadAsync(createNotificationRegistry());

  // const i18nService = container.get(I18nService);
  // const odataConfig = createODataConfig(i18nService.getLanguage(), options.resolveUri);
  // container.bindConstant(ODataService, new ODataService(finalODataConfig, "price-agreement"));

  return container;
};
