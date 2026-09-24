import { Eyebrow } from "../../App.styles";
import { useChat } from "../../hooks";
import {
  BrandMark,
  Connection,
  Header,
  SettingsButton,
  StatusDot,
  TextOnly,
  Title,
} from "./styles";

export function AppHeader() {
  const { isConnected, setIsSettingsOpen } = useChat();

  return (
    <Header>
      <BrandMark>
        <img src={`${import.meta.env.BASE_URL}green-api-logo.svg`} alt="GREEN-API" />
      </BrandMark>
      <div>
        <Eyebrow>GREEN-API messenger</Eyebrow>
        <Title>Telegram сообщения</Title>
      </div>
      <Connection>
        <StatusDot $online={isConnected} />
        <span>{isConnected ? "Подключено" : "Ожидает подключения"}</span>
      </Connection>
      <TextOnly>Только текстовые сообщения</TextOnly>
      <SettingsButton
        type="button"
        onClick={() => setIsSettingsOpen(true)}
        aria-label="Открыть настройки"
      >
        •••
      </SettingsButton>
    </Header>
  );
}
