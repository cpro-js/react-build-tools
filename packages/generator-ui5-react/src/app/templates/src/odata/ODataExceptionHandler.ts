import { ErrorMessageRetriever } from "@odata2ts/axios-odata-client";

interface SapError {
  error: {
    "@SAP__common.ExceptionCategory": string;
    "@SAP__common.Timestamp": string;
    "@SAP__common.TransactionId": string;
    code: string;
    message: string;
  };
}

export const getErrorMessage: ErrorMessageRetriever = error => {
  if (error.isAxiosError && error.response?.data) {
    const sapError = error.response.data as SapError;
    if (sapError.error.message) {
      return sapError.error.message;
    }
  }
  return error.message ?? error;
};
