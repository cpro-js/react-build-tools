import { ErrorMessageRetriever } from "@odata2ts/axios-odata-client";

export interface SapErrorODataV4 {
  error: {
    "@SAP__common.ExceptionCategory": string;
    "@SAP__common.Timestamp": string;
    "@SAP__common.TransactionId": string;
    code: string;
    message: string;
  };
}

export interface SapErrorODataV2 {
  error: {
    code: string;
    message: {
      lang: string;
      value: string;
    };
  };
}

export const getErrorMessage: ErrorMessageRetriever = error => {
  if (error.isAxiosError && error.response?.data) {
    let data = error.response.data as SapErrorODataV4 | SapErrorODataV2 | string;

    if (typeof data === "string") {
      let dataJson: SapErrorODataV4 | SapErrorODataV2 | undefined = undefined;
      try {
        dataJson = JSON.parse(data) as SapErrorODataV4 | SapErrorODataV2;
      } catch (e) {}
      if (dataJson != null) {
        data = dataJson;
      } else if (/.*<message>(.*)<\/message>.*/.test(data)) {
        // it's XML, though => regexp parsing of message value
        return data.replace(/.*<message.*>(.*)<\/message>.*/, "$1").trim();
      }
    }
    if (typeof data !== "string") {
      if (typeof data.error?.message === "string") {
        return data.error.message;
      } else if ((data as SapErrorODataV2).error?.message?.value) {
        return (data as SapErrorODataV2).error.message.value;
      }
    }
  }

  return error.message ?? error;
};
