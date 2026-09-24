import type { GreenApiChat, Message } from "../types/chat";
import type {
  GreenApiCheckAccount,
  GreenApiHistoryMessage,
  IncomingNotification,
} from "../services/greenApi";

export const formatHistoryMessages = (
  history: GreenApiHistoryMessage[],
): Message[] => {
  
  return history
    .filter((msg) => msg.typeMessage === "textMessage" && msg.textMessage)
    .reverse()
    .map((msg) => ({
      id: msg.idMessage,
      text: msg.textMessage ?? "",
      direction: msg.type === "outgoing" ? "outgoing" : "incoming",
      time: new Intl.DateTimeFormat("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(msg.timestamp * 1000)),
      status: msg.type === "outgoing" ? "sent" : undefined,
    }));
};

export const parseNotificationMessage = (
  notification: IncomingNotification,
): { incomingText?: string; senderChatId?: string } => {
  const messageData = notification.body?.messageData;

  return {
    incomingText: messageData?.textMessageData?.textMessage,
    senderChatId: notification.body?.senderData?.chatId,
  };
};

export const determineChatInfo = (
  query: string,
  chats: GreenApiChat[],
  account: GreenApiCheckAccount,
) => {
  const existingChat = chats.find((chat) => chat.chatId === query);
  const displayName =
    existingChat?.username || existingChat?.name || account.username || query;

  return {
    displayName,
    isExisting: !!existingChat,
  };
};
