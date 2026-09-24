import { useEffect, useRef } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useChat } from "../../hooks";
import {
  Area,
  Bubble,
  Composer,
  Divider,
  Header,
  HeaderCopy,
  MessageInput,
  Panel,
  ProviderLabel,
  Row,
  SendButton,
  Status,
} from "./styles";
import { Avatar } from "../../App.styles";

export function ChatPanel() {
  const {
    phone,
    chatName,
    messages,
    draft,
    isSending,
    isConnected,
    setDraft,
    sendMessage,
    chatEndRef,
  } = useChat();

  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!draft && messageInputRef.current) {
      messageInputRef.current.style.height = "46px";
    }
  }, [draft]);

  const resizeMessageInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(event.target.value);
    event.target.style.height = "auto";
    event.target.style.height = `${Math.min(event.target.scrollHeight, 180)}px`;
  };

  const handleMessageKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <Panel>
      <Header>
        <Avatar $large>{phone ? phone.slice(-2) : "—"}</Avatar>
        <HeaderCopy>
          <h2>{chatName || "Новый диалог"}</h2>
          <p>
            {phone ? "GREEN-API · личный чат" : "Выберите получателя слева"}
          </p>
        </HeaderCopy>
        <ProviderLabel>
          GREEN-API <span>⌁</span>
        </ProviderLabel>
      </Header>
      <Area>
        <Divider>
          <span>Сегодня</span>
        </Divider>
        {messages.map((message) => (
          <Row $outgoing={message.direction === "outgoing"} key={message.id}>
            <Bubble $outgoing={message.direction === "outgoing"}>
              <p>{message.text}</p>
              <footer>
                <time>{message.time}</time>
                {message.direction === "outgoing" && (
                  <Status $error={message.status === "error"}>
                    {message.status === "error"
                      ? "!"
                      : message.status === "sending"
                        ? "◷"
                        : "✓✓"}
                  </Status>
                )}
              </footer>
            </Bubble>
          </Row>
        ))}
        <div ref={chatEndRef} />
      </Area>
      <Composer onSubmit={sendMessage}>
        <MessageInput
          ref={messageInputRef}
          value={draft}
          onChange={resizeMessageInput}
          onKeyDown={handleMessageKeyDown}
          placeholder={
            phone ? "Напишите сообщение..." : "Сначала добавьте номер"
          }
          disabled={!phone || !isConnected}
        />
        <SendButton
          type="submit"
          disabled={!draft.trim() || !phone || !isConnected || isSending}
          aria-label="Отправить сообщение"
        >
          ↗
        </SendButton>
      </Composer>
    </Panel>
  );
}
