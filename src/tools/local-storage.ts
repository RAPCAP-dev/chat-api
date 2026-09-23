import type { GreenApiCredentials } from "../types/chat";

export const readStoredCredentials = (): GreenApiCredentials => ({
  apiUrl:
    localStorage.getItem("green-api-url") ?? "https://4100.api.green-api.com",
  idInstance: localStorage.getItem("green-api-id-instance") ?? "",
  apiTokenInstance: localStorage.getItem("green-api-token") ?? "",
});
