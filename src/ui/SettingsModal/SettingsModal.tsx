import type { MouseEvent } from "react";
import { useChat } from "../../hooks";
import {
  Backdrop,
  CloseButton,
  Description,
  Heading,
  Input,
  Label,
  Modal,
  SaveButton,
  Title,
} from "./styles";
import { Eyebrow } from "../../App.styles";

export function SettingsModal() {
  const { credentials, setCredentials, saveSettings, setIsSettingsOpen } =
    useChat();

  return (
    <Backdrop onMouseDown={() => setIsSettingsOpen(false)}>
      <Modal
        onSubmit={saveSettings}
        onMouseDown={(event: MouseEvent) => event.stopPropagation()}
      >
        <Heading>
          <div>
            <Eyebrow>Подключение</Eyebrow>
            <Title>Настройки GREEN-API</Title>
          </div>
          <CloseButton
            type="button"
            onClick={() => setIsSettingsOpen(false)}
            aria-label="Закрыть"
          >
            ×
          </CloseButton>
        </Heading>
        <Description>
          Введите данные инстанса GREEN-API, чтобы отправлять и получать
          текстовые сообщения.
        </Description>
        <Label htmlFor="api-url">apiUrl</Label>
        <Input
          id="api-url"
          type="url"
          value={credentials.apiUrl}
          onChange={(event) =>
            setCredentials({
              ...credentials,
              apiUrl: event.target.value,
            })
          }
          placeholder="https://4100.api.green-api.com"
        />
        <Label htmlFor="id-instance">idInstance</Label>
        <Input
          id="id-instance"
          value={credentials.idInstance}
          onChange={(event) =>
            setCredentials({
              ...credentials,
              idInstance: event.target.value,
            })
          }
          placeholder="Ваш idInstance"
        />
        <Label htmlFor="api-token">apiTokenInstance</Label>
        <Input
          id="api-token"
          type="password"
          value={credentials.apiTokenInstance}
          onChange={(event) =>
            setCredentials({
              ...credentials,
              apiTokenInstance: event.target.value,
            })
          }
          placeholder="Ваш apiTokenInstance"
        />
        <SaveButton type="submit">
          Сохранить подключение <span>↗</span>
        </SaveButton>
      </Modal>
    </Backdrop>
  );
}
