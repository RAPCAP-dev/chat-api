import { useEffect, useRef } from "react";
import type { GreenApiCredentials } from "../types/chat";
import {
  deleteGreenApiNotification,
  isIncomingGreenApiMessage,
  receiveGreenApiNotification,
} from "../services/greenApi";
import { parseNotificationMessage } from "../tools";

interface UseMessagePollingArgs {
  enabled: boolean;
  credentials: GreenApiCredentials;
  phone: string;
  onIncoming: (text: string, receiptId: number) => void;
}

export const useMessagePolling = ({
  enabled,
  credentials,
  phone,
  onIncoming,
}: UseMessagePollingArgs) => {
  const processedReceiptIdsRef = useRef(new Set<number>());

  useEffect(() => {
    if (!enabled || !phone) return;
    let isActive = true;

    const receiveMessages = async () => {
      try {
        const notification = await receiveGreenApiNotification(credentials);
        if (!isActive || !notification) return;
        if (processedReceiptIdsRef.current.has(notification.receiptId)) return;

        processedReceiptIdsRef.current.add(notification.receiptId);

        if (!isIncomingGreenApiMessage(notification)) {
          await deleteGreenApiNotification(credentials, notification.receiptId);
          return;
        }

        const { incomingText, senderChatId } =
          parseNotificationMessage(notification);

        if (incomingText && senderChatId === phone) {
          onIncoming(incomingText, notification.receiptId);
        }
        await deleteGreenApiNotification(credentials, notification.receiptId);
      } catch {}
    };

    const interval = window.setInterval(receiveMessages, 5000);
    receiveMessages();

    return () => {
      isActive = false;
      window.clearInterval(interval);
    };
  }, [enabled, credentials, phone, onIncoming]);
};
