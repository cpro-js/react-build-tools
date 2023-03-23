import { Container, I18nService, createI18nModuleRegistry } from "@cpro-js/react-core";
import { createNotificationRegistry } from "@cpro-js/react-ui5-notification";
import { AxiosODataClient } from "@odata2ts/axios-odata-client";
// @ts-ignore: no typings available
import { setLanguage } from "@ui5/webcomponents-base/dist/config/Language";

import { MainODataService } from "../generated/odata-service/MainODataService";
import { createI18nConfig } from "./i18n.config";
import { ODATA_SERVICE_PATHS, createODataConfig } from "./odata.config";

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
  const odataClient = new AxiosODataClient(odataConfig);
  container.bindConstant(MainODataService, new MainODataService(odataClient, ODATA_SERVICE_PATHS.main));

  return container;
};
