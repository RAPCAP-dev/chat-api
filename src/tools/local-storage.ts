import type { GreenApiCredentials } from "../types/chat";

const STORAGE_KEYS = {
  apiUrl: "green-api-url",
  idInstance: "green-api-id-instance",
  apiToken: "green-api-token",
  phone: "green-api-phone",
  chatName: "green-api-chat-name",
} as const;

export const readStoredCredentials = (): GreenApiCredentials => ({
  apiUrl:
    localStorage.getItem(STORAGE_KEYS.apiUrl) ?? "https://4100.api.green-api.com",
  idInstance: localStorage.getItem(STORAGE_KEYS.idInstance) ?? "",
  apiTokenInstance: localStorage.getItem(STORAGE_KEYS.apiToken) ?? "",
});

export const saveStoredCredentials = (credentials: GreenApiCredentials) => {
  localStorage.setItem(STORAGE_KEYS.apiUrl, credentials.apiUrl);
  localStorage.setItem(STORAGE_KEYS.idInstance, credentials.idInstance);
  localStorage.setItem(STORAGE_KEYS.apiToken, credentials.apiTokenInstance);
};

export const readStoredPhone = () =>
  localStorage.getItem(STORAGE_KEYS.phone) ?? "";

export const saveStoredPhone = (phone: string) =>
  localStorage.setItem(STORAGE_KEYS.phone, phone);

export const readStoredChatName = () =>
  localStorage.getItem(STORAGE_KEYS.chatName) ?? "";

export const saveStoredChatName = (name: string) =>
  localStorage.setItem(STORAGE_KEYS.chatName, name);
