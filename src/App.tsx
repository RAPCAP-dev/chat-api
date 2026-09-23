import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  checkGreenApiAccount,
  configureGreenApiReceiving,
  deleteGreenApiNotification,
  getGreenApiChatHistory,
  getGreenApiChats,
  getGreenApiSettings,
  getGreenApiState,
  isIncomingGreenApiMessage,
  receiveGreenApiNotification,
  sendGreenApiMessage,
} from "./services/greenApi";
import type { GreenApiChat, GreenApiCredentials, Message } from "./types/chat";
import { AppHeader } from "./ui/AppHeader/AppHeader";
import { ChatPanel } from "./ui/ChatPanel/ChatPanel";
import { SettingsModal } from "./ui/SettingsModal/SettingsModal";
import { Sidebar } from "./ui/Sidebar";
import { Notice, Workspace, AppWrapper } from "./App.styles";
import { formatTimeNow, readStoredCredentials } from "./tools";

function App() {
  const [credentials, setCredentials] = useState<GreenApiCredentials>(
    readStoredCredentials,
  );
  const [phone, setPhone] = useState(
    localStorage.getItem("green-api-phone") ?? "",
  );
  const [chatName, setChatName] = useState(
    localStorage.getItem("green-api-chat-name") ?? "",
  );
  const [chatQuery, setChatQuery] = useState(
    localStorage.getItem("green-api-chat-name") ||
      localStorage.getItem("green-api-phone") ||
      "",
  );
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<GreenApiChat[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(() => {
    const stored = readStoredCredentials();
    return !stored.idInstance || !stored.apiTokenInstance;
  });
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [notice, setNotice] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const processedReceiptIdsRef = useRef(new Set<number>());
  const hasCredentials = Boolean(
    credentials.apiUrl &&
    credentials.idInstance &&
    credentials.apiTokenInstance,
  );
  const shouldRestoreConnectionRef = useRef(hasCredentials);

  useLayoutEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
  }, [messages]);

  useEffect(() => {
    if (!isConnected || !phone) return;
    let isActive = true;
    const receiveMessages = async () => {
      try {
        const notification = await receiveGreenApiNotification(credentials);
        if (!isActive) return;
        if (!notification) return;
        if (processedReceiptIdsRef.current.has(notification.receiptId)) return;
        processedReceiptIdsRef.current.add(notification.receiptId);
        if (!isIncomingGreenApiMessage(notification)) {
          await deleteGreenApiNotification(credentials, notification.receiptId);
          return;
        }
        const messageData = notification.body?.messageData;
        const incomingText = messageData?.textMessageData?.textMessage;
        const senderChatId = notification.body?.senderData?.chatId;
        if (incomingText && senderChatId === phone) {
          setMessages((current) => [
            ...current,
            {
              id: String(notification.receiptId),
              text: incomingText,
              direction: "incoming",
              time: formatTimeNow(),
            },
          ]);
        }
        await deleteGreenApiNotification(credentials, notification.receiptId);
      } catch {
        // Polling retries automatically while GREEN-API is unavailable.
      }
    };
    const interval = window.setInterval(receiveMessages, 5000);
    receiveMessages();
    return () => {
      isActive = false;
      window.clearInterval(interval);
    };
  }, [credentials, isConnected, phone]);

  function showNotice(text: string) {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 3000);
  }

  const loadChatHistory = async (chatId: string) => {
    try {
      const history = await getGreenApiChatHistory(credentials, chatId);
      setMessages(
        history
          .filter(
            (message) =>
              message.typeMessage === "textMessage" && message.textMessage,
          )
          .reverse()
          .map((message) => ({
            id: message.idMessage,
            text: message.textMessage ?? "",
            direction: message.type === "outgoing" ? "outgoing" : "incoming",
            time: new Intl.DateTimeFormat("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(message.timestamp * 1000)),
            status: message.type === "outgoing" ? "sent" : undefined,
          })),
      );
    } catch {
      showNotice("Не удалось загрузить историю выбранного чата");
    }
  };

  const connectToGreenApi = async () => {
    if (!hasCredentials || isConnecting) return false;
    setIsConnecting(true);
    setIsConnected(false);
    try {
      const state = await getGreenApiState(credentials);
      if (state.stateInstance !== "authorized") {
        throw new Error(`Инстанс не авторизован: ${state.stateInstance}`);
      }
      const settings = await getGreenApiSettings(credentials);
      if (settings.webhookUrl || settings.incomingWebhook !== "yes") {
        await configureGreenApiReceiving(credentials);
      }
      const loadedChats = await getGreenApiChats(credentials);
      setChats(loadedChats);
      setIsConnected(true);
      const restoredChat = loadedChats.find((chat) => chat.chatId === phone);
      if (restoredChat) {
        const displayName = restoredChat.username || restoredChat.name || phone;
        setChatName(displayName);
        setChatQuery(displayName);
      }
      if (phone) await loadChatHistory(phone);
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
  };

  useEffect(() => {
    if (!shouldRestoreConnectionRef.current) return;
    const timer = window.setTimeout(() => {
      if (shouldRestoreConnectionRef.current) {
        shouldRestoreConnectionRef.current = false;
        void connectToGreenApi();
      }
    }, 0);
    return () => window.clearTimeout(timer);
    // This intentionally runs once for credentials restored from localStorage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem("green-api-url", credentials.apiUrl);
    localStorage.setItem("green-api-id-instance", credentials.idInstance);
    localStorage.setItem("green-api-token", credentials.apiTokenInstance);
    const connected = await connectToGreenApi();
    if (connected) setIsSettingsOpen(false);
  };

  const startChat = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = chatQuery.trim();
    if (!query) {
      showNotice("Введите номер получателя");
      return;
    }
    let resolvedChatId = query;
    const isNewUserLookup =
      query.startsWith("@") ||
      /[a-z_]/i.test(query) ||
      /^\+?\d{10,15}$/.test(query);
    if (isNewUserLookup) {
      if (!isConnected) {
        showNotice("Сначала подключите GREEN-API в настройках");
        return;
      }
      try {
        const account = await checkGreenApiAccount(credentials, query);
        if (!account.exist || !account.chatId) {
          showNotice("Пользователь не найден или ограничил поиск");
          return;
        }
        resolvedChatId = account.chatId;
        const existingChat = chats.find(
          (chat) => chat.chatId === resolvedChatId,
        );
        const displayName =
          existingChat?.username ||
          existingChat?.name ||
          account.username ||
          query;
        setChatName(displayName);
        setChatQuery(displayName);
        localStorage.setItem("green-api-chat-name", displayName);
        setChats((current) =>
          current.some((chat) => chat.chatId === resolvedChatId)
            ? current
            : [
                ...current,
                {
                  chatId: resolvedChatId,
                  name: displayName,
                  username: account.username,
                  type: "user",
                },
              ],
        );
      } catch (error) {
        showNotice(
          error instanceof Error
            ? `Проверка пользователя не выполнена: ${error.message}`
            : "Проверка пользователя не выполнена",
        );
        return;
      }
    }
    setPhone(resolvedChatId);
    if (!isNewUserLookup) setChatQuery(chatName || query);
    localStorage.setItem("green-api-phone", resolvedChatId);
    if (isConnected) await loadChatHistory(resolvedChatId);
    else setMessages([]);
    showNotice("Чат открыт");
  };

  const selectChat = async (chat: GreenApiChat) => {
    setPhone(chat.chatId);
    const displayName = chat.username || chat.name || chat.chatId;
    setChatName(displayName);
    setChatQuery(displayName);
    localStorage.setItem("green-api-phone", chat.chatId);
    localStorage.setItem("green-api-chat-name", displayName);
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
        current.map((message) =>
          message.id === messageId ? { ...message, status: "sent" } : message,
        ),
      );
    } catch {
      setMessages((current) =>
        current.map((message) =>
          message.id === messageId ? { ...message, status: "error" } : message,
        ),
      );
      showNotice("Сообщение не отправлено. Проверьте подключение и Chat ID.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AppWrapper>
      <AppHeader
        isConnected={isConnected}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />

      <Workspace>
        <Sidebar
          phone={phone}
          chatQuery={chatQuery}
          chats={chats}
          isLoading={isConnecting}
          onChatQueryChange={setChatQuery}
          onStartChat={startChat}
          onSelectChat={selectChat}
        />
        <ChatPanel
          phone={phone}
          chatName={chatName}
          messages={messages}
          draft={draft}
          isSending={isSending}
          hasCredentials={isConnected}
          onDraftChange={setDraft}
          onSend={sendMessage}
          chatEndRef={chatEndRef}
        />
      </Workspace>

      {notice && <Notice>{notice}</Notice>}

      {isSettingsOpen && (
        <SettingsModal
          credentials={credentials}
          onCredentialsChange={setCredentials}
          onSave={saveSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </AppWrapper>
  );
}

export default App;
