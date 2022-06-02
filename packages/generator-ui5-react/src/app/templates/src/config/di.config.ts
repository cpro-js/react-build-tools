import { Container, I18nService, createI18nModuleRegistry } from "@cpro-js/react-core";

import { createI18nConfig } from "./i18n.config";

// import { createODataConfig } from "./odata.config";

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

  await container.loadAsync(async () => {
    // initialize I18nService
    await createI18nModuleRegistry(createI18nConfig(options.locale));

    // const i18nService = container.get(I18nService);
    // const odataConfig = createODataConfig(i18nService.getLanguage(), options.resolveUri);

    // container.bindConstant(ODataService, new ODataService(finalODataConfig, "price-agreement"));
  });

  return container;
};
