import { useCallback, useState } from "react";
import type { GreenApiChat, GreenApiCredentials } from "../types/chat";
import {
  configureGreenApiReceiving,
  getGreenApiChats,
  getGreenApiSettings,
  getGreenApiState,
} from "../services/greenApi";

interface UseGreenApiConnectionArgs {
  credentials: GreenApiCredentials;
  hasCredentials: boolean;
  showNotice: (text: string) => void;
  onConnected: (chats: GreenApiChat[]) => Promise<void> | void;
}

export const useGreenApiConnection = ({
  credentials,
  hasCredentials,
  showNotice,
  onConnected,
}: UseGreenApiConnectionArgs) => {
  const [chats, setChats] = useState<GreenApiChat[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async () => {
    if (!hasCredentials || isConnecting) return false;
    setIsConnecting(true);
    setIsConnected(false);
    try {
      const state = await getGreenApiState(credentials);
      if (state.stateInstance !== "authorized")
        throw new Error(`Инстанс не авторизован: ${state.stateInstance}`);

      const settings = await getGreenApiSettings(credentials);
      if (settings.webhookUrl || settings.incomingWebhook !== "yes")
        await configureGreenApiReceiving(credentials);

      const loadedChats = await getGreenApiChats(credentials);
      setChats(loadedChats);
      setIsConnected(true);
      await onConnected(loadedChats);
      showNotice(`Подключено. Загружено чатов: ${loadedChats.length}`);
      return true;
    } catch (error) {
      setIsConnected(false);
      showNotice(
        error instanceof Error
          ? `Подключение не выполнено: ${error.message}`
          : "Подключение не выполнено",
      );
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [credentials, hasCredentials, isConnecting, showNotice, onConnected]);

  return { chats, setChats, isConnected, isConnecting, connect };
};
