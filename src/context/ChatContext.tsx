import React, {
  createContext,
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
  type FormEvent,
} from "react";

import type { GreenApiChat, GreenApiCredentials, Message } from "../types/chat";
import {
  checkGreenApiAccount,
  getGreenApiChatHistory,
  sendGreenApiMessage,
} from "../services/greenApi";
import {
  determineChatInfo,
  formatHistoryMessages,
  formatTimeNow,
  readStoredChatName,
  readStoredCredentials,
  readStoredPhone,
  saveStoredChatName,
  saveStoredCredentials,
  saveStoredPhone,
} from "../tools";
import { useNotice } from "../hooks/useNotice";
import { useGreenApiConnection } from "../hooks/useGreenApiConnection";
import { useMessagePolling } from "../hooks/useMessagePolling";

export interface ChatContextProps {
  credentials: GreenApiCredentials;
  setCredentials: React.Dispatch<React.SetStateAction<GreenApiCredentials>>;
  phone: string;
  chatName: string;
  chatQuery: string;
  setChatQuery: (value: string) => void;
  draft: string;
  setDraft: (value: string) => void;
  messages: Message[];
  chats: GreenApiChat[];
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isConnected: boolean;
  isConnecting: boolean;
  isSending: boolean;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  saveSettings: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  startChat: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  selectChat: (chat: GreenApiChat) => Promise<void>;
  sendMessage: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

export const ChatContext = createContext<ChatContextProps | null>(null);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { showNotice } = useNotice();

  const [credentials, setCredentials] = useState<GreenApiCredentials>(
    readStoredCredentials,
  );
  const [phone, setPhone] = useState(readStoredPhone);
  const [chatName, setChatName] = useState(readStoredChatName);
  const [chatQuery, setChatQuery] = useState(
    () => readStoredChatName() || readStoredPhone(),
  );
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(() => {
    const stored = readStoredCredentials();
    return !stored.idInstance || !stored.apiTokenInstance;
  });
  const [isSending, setIsSending] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const hasCredentials = Boolean(
    credentials.apiUrl &&
      credentials.idInstance &&
      credentials.apiTokenInstance,
  );
  const shouldRestoreConnectionRef = useRef(hasCredentials);

  useLayoutEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
  }, [messages]);

  const loadChatHistory = useCallback(
    async (chatId: string) => {
      try {
        const history = await getGreenApiChatHistory(credentials, chatId);
        setMessages(formatHistoryMessages(history));
      } catch {
        showNotice("Не удалось загрузить историю выбранного чата");
      }
    },
    [credentials, showNotice],
  );

  const appendIncomingMessage = useCallback(
    (text: string, receiptId: number) => {
      setMessages((current) => [
        ...current,
        {
          id: String(receiptId),
          text,
          direction: "incoming",
          time: formatTimeNow(),
        },
      ]);
    },
    [],
  );

  const handleConnected = useCallback(
    (loadedChats: GreenApiChat[]) => {
      const restoredChat = loadedChats.find((chat) => chat.chatId === phone);
      if (restoredChat) {
        const displayName = restoredChat.username || restoredChat.name || phone;
        setChatName(displayName);
        setChatQuery(displayName);
      }
      if (phone) return loadChatHistory(phone);
    },
    [phone, loadChatHistory],
  );

  const { chats, setChats, isConnected, isConnecting, connect } =
    useGreenApiConnection({
      credentials,
      hasCredentials,
      showNotice,
      onConnected: handleConnected,
    });

  useMessagePolling({
    enabled: isConnected && Boolean(phone),
    credentials,
    phone,
    onIncoming: appendIncomingMessage,
  });

  useEffect(() => {
    if (!shouldRestoreConnectionRef.current) return;
    const timer = window.setTimeout(() => {
      if (shouldRestoreConnectionRef.current) {
        shouldRestoreConnectionRef.current = false;
        void connect();
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [connect]);

  const saveSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveStoredCredentials(credentials);
    if (await connect()) setIsSettingsOpen(false);
  };

  const startChat = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = chatQuery.trim();
    if (!query) return showNotice("Введите номер получателя");

    let resolvedChatId = query;
    const isNewUserLookup =
      query.startsWith("@") ||
      /[a-z_]/i.test(query) ||
      /^\+?\d{10,15}\$/.test(query);

    if (isNewUserLookup) {
      if (!isConnected)
        return showNotice("Сначала подключите GREEN-API в настройках");
      try {
        const account = await checkGreenApiAccount(credentials, query);
        if (!account.exist || !account.chatId)
          return showNotice("Пользователь не найден или ограничил поиск");

        resolvedChatId = account.chatId;
        const { displayName, isExisting } = determineChatInfo(
          resolvedChatId,
          chats,
          account,
        );

        setChatName(displayName);
        setChatQuery(displayName);
        saveStoredChatName(displayName);

        if (!isExisting) {
          setChats((current) => [
            ...current,
            {
              chatId: resolvedChatId,
              name: displayName,
              username: account.username,
              type: "user",
            },
          ]);
        }
      } catch (error) {
        return showNotice(
          error instanceof Error
            ? `Проверка пользователя не выполнена: ${error.message}`
            : "Проверка пользователя не выполнена",
        );
      }
    }
    setPhone(resolvedChatId);
    if (!isNewUserLookup) setChatQuery(chatName || query);
    saveStoredPhone(resolvedChatId);
    if (isConnected) await loadChatHistory(resolvedChatId);
    else setMessages([]);
    showNotice("Чат открыт");
  };

  const selectChat = async (chat: GreenApiChat) => {
    setPhone(chat.chatId);
    const displayName = chat.username || chat.name || chat.chatId;
    setChatName(displayName);
    setChatQuery(displayName);
    saveStoredPhone(chat.chatId);
    saveStoredChatName(displayName);
    await loadChatHistory(chat.chatId);
  };

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !phone || !isConnected || isSending) return;

    const messageId = `${Date.now()}`;
    setDraft("");
    setIsSending(true);
    setMessages((current) => [
      ...current,
      {
        id: messageId,
        text,
        direction: "outgoing",
        time: formatTimeNow(),
        status: "sending",
      },
    ]);

    try {
      await sendGreenApiMessage(credentials, phone, text);
      setMessages((current) =>
        current.map((msg) =>
          msg.id === messageId ? { ...msg, status: "sent" } : msg,
        ),
      );
    } catch {
      setMessages((current) =>
        current.map((msg) =>
          msg.id === messageId ? { ...msg, status: "error" } : msg,
        ),
      );
      showNotice("Сообщение не отправлено. Проверьте подключение и Chat ID.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        credentials,
        setCredentials,
        phone,
        chatName,
        chatQuery,
        setChatQuery,
        draft,
        setDraft,
        messages,
        chats,
        isSettingsOpen,
        setIsSettingsOpen,
        isConnected,
        isConnecting,
        isSending,
        chatEndRef,
        saveSettings,
        startChat,
        selectChat,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
