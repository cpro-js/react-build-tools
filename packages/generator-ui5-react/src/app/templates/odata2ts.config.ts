import { ConfigFileOptions, EmitModes, Modes } from "@odata2ts/odata2ts";

const config: ConfigFileOptions = {
  mode: Modes.service,
  emitMode: EmitModes.ts,
  allowRenaming: true,
  services: {
    odata: {
      serviceName: "MainOData",
      source: "src/asset/odata/odata-service.xml",
      output: "src/generated/odata-service",
    },
  },
};

export default config;
