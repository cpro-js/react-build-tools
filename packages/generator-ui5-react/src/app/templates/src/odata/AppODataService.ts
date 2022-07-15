import { AxiosODataClient } from "@odata2ts/axios-odata-client";
import { AxiosRequestConfig } from "axios";

import { getErrorMessage } from "./ErrorMessageHandler";
import { CentralODataService } from "./odata-service/CentralODataService";

export class AppODataService extends CentralODataService {
  constructor(odataConfig: AxiosRequestConfig) {
    // TODO: change ODATA_SERVICE_NAME to your specific odata service
    super(new AxiosODataClient(getErrorMessage, odataConfig), "/odata/sap/ODATA_SERVICE_NAME");
  }
}
