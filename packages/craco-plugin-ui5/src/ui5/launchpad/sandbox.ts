import { LaunchpadTile } from "../../types";

export const createFioriSandboxConfigJson = (
  appId: string,
  tilesConfig: Array<LaunchpadTile>
) => {
  const tiles = tilesConfig.map((tileConfig, index) => ({
    id: `app-id-${index}`,
    title: "",
    size: "1x1",
    tileType: "sap.ushell.ui.tile.StaticTile",
    properties: {
      chipId: "catalogTile_00",
      title: tileConfig.title,
      subtitle: tileConfig.subtitle,
      info: tileConfig.info,
      icon: tileConfig.icon,
      targetURL: "#" + tileConfig.semanticObject + "-" + tileConfig.action,
    },
  }));

  return {
    services: {
      LaunchPage: {
        adapter: {
          config: {
            catalogs: [
              {
                id: "sample_catalog",
                title: "Sample Application Catalog",
                tiles: tiles,
              },
            ],
            groups: [
              {
                id: "sample_group",
                isGroupLocked: false,
                isPreset: true,
                isVisible: true,
                title: "Sample Applications",
                tiles: tiles,
              },
            ],
          },
        },
      },
      NavTargetResolution: {
        config: {
          enableClientSideTargetResolution: true,
        },
      },
      ClientSideTargetResolution: {
        adapter: {
          config: {
            inbounds: {
              ...tilesConfig.reduce<{ [key: string]: {} }>(
                (inboundConfig, tileConfig) => {
                  inboundConfig[
                    tileConfig.semanticObject + "-" + tileConfig.action
                  ] = {
                    semanticObject: tileConfig.semanticObject,
                    action: tileConfig.action,
                    title: tileConfig.title,
                    signature: {
                      parameters: Object.entries(
                        tileConfig.defaultParameters ?? {}
                      ).reduce<{ [key: string]: {} }>(
                        (parameters, [parameterName, parameterValue]) => {
                          parameters[parameterName] = {
                            defaultValue: {
                              // todo array is not working yet
                              // value: Array.isArray(parameterValue) ? parameterValue.join(",") : parameterValue,
                              // format: Array.isArray(parameterValue) ? "array" : "value"
                              value: parameterValue,
                            },
                          };
                          return parameters;
                        },
                        {}
                      ),
                      additionalParameters: tileConfig.additionalParameters
                        ? "allowed"
                        : "notallowed",
                    },
                    resolutionResult: {
                      applicationType: "URL",
                      additionalInformation: `SAPUI5.Component=${appId}`,
                      url: "./",
                    },
                  };

                  return inboundConfig;
                },
                {}
              ),
            },
          },
        },
      },
    },
  };
};
