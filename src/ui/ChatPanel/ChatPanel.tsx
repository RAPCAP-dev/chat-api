import { useEffect, useRef } from "react";
import type { ChangeEvent, FormEvent, KeyboardEvent, RefObject } from "react";
import type { Message } from "../../types/chat";
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

type ChatPanelProps = {
  phone: string;
  chatName?: string;
  messages: Message[];
  draft: string;
  isSending: boolean;
  hasCredentials: boolean;
  onDraftChange: (draft: string) => void;
  onSend: (event: FormEvent<HTMLFormElement>) => void;
  chatEndRef: RefObject<HTMLDivElement | null>;
};

export function ChatPanel({
  phone,
  chatName,
  messages,
  draft,
  isSending,
  hasCredentials,
  onDraftChange,
  onSend,
  chatEndRef,
}: ChatPanelProps) {
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!draft && messageInputRef.current) {
      messageInputRef.current.style.height = "46px";
    }
  }, [draft]);

  const resizeMessageInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onDraftChange(event.target.value);
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
      <Composer onSubmit={onSend}>
        <MessageInput
          ref={messageInputRef}
          value={draft}
          onChange={resizeMessageInput}
          onKeyDown={handleMessageKeyDown}
          placeholder={
            phone ? "Напишите сообщение..." : "Сначала добавьте номер"
          }
          disabled={!phone || !hasCredentials}
        />
        <SendButton
          type="submit"
          disabled={!draft.trim() || !phone || !hasCredentials || isSending}
          aria-label="Отправить сообщение"
        >
          ↗
        </SendButton>
      </Composer>
    </Panel>
  );
}
