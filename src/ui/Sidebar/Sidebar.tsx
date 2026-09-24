import { Avatar, Eyebrow, SerifHeading } from "../../App.styles";
import {
  Arrow,
  ChatCopy,
  ChatList,
  ChatPreview,
  Count,
  Empty,
  Form,
  Heading,
  Input,
  Label,
  LoadingRow,
  OpenButton,
  Panel,
  PhoneInput,
  Spinner,
} from "./styles";
import { useChat } from "../../hooks";

export function Sidebar() {
  const {
    phone,
    chatQuery,
    chats,
    isConnecting,
    setChatQuery,
    selectChat,
    startChat,
  } = useChat();

  return (
    <Panel>
      <Heading>
        <div>
          <Eyebrow>Ваши чаты</Eyebrow>
          <SerifHeading>Диалоги</SerifHeading>
        </div>
        <Count>{chats.length || (phone ? "1" : "0")}</Count>
      </Heading>
      <Form onSubmit={startChat}>
        <Label htmlFor="chat-id">Новый чат</Label>
        <PhoneInput>
          <span>#</span>
          <Input
            id="chat-id"
            value={chatQuery}
            onChange={(event) => setChatQuery(event.target.value)}
            placeholder="Chat ID или username"
          />
        </PhoneInput>
        <OpenButton type="submit">
          Открыть чат <span>↗</span>
        </OpenButton>
      </Form>
      {isConnecting && (
        <LoadingRow>
          <Spinner /> Загружаем ваши чаты...
        </LoadingRow>
      )}
      {chats.length ? (
        <ChatList>
          {chats.map((chat) => (
            <ChatPreview
              type="button"
              key={chat.chatId}
              onClick={() => selectChat(chat)}
            >
              <Avatar>
                {(chat.name || chat.username || chat.chatId)
                  .slice(0, 2)
                  .toUpperCase()}
              </Avatar>
              <ChatCopy>
                <strong>{chat.username || chat.name || "Личный чат"}</strong>
                <small>
                  {chat.username ? "Telegram · личный чат" : "Личный чат"}
                </small>
              </ChatCopy>
              <Arrow>›</Arrow>
            </ChatPreview>
          ))}
        </ChatList>
      ) : phone ? (
        <ChatPreview type="button">
          <Avatar>{phone.slice(-2)}</Avatar>
          <ChatCopy>
            <strong>Новый чат</strong>
            <small>Telegram · GREEN-API</small>
          </ChatCopy>
          <Arrow>›</Arrow>
        </ChatPreview>
      ) : (
        <Empty>
          <span>✈</span>
          <p>
            Добавьте Chat ID или username,
            <br />
            чтобы начать диалог
          </p>
        </Empty>
      )}
    </Panel>
  );
}
