import { Eyebrow } from "../../App.styles";
import {
  BrandMark,
  Connection,
  Header,
  SettingsButton,
  StatusDot,
  TextOnly,
  Title,
} from "./styles";

type AppHeaderProps = { isConnected: boolean; onSettingsClick: () => void };

export function AppHeader({ isConnected, onSettingsClick }: AppHeaderProps) {
  return (
    <Header>
      <BrandMark>
        <img src="/green-api-logo.svg" alt="GREEN-API" />
      </BrandMark>
      <div>
        <Eyebrow>GREEN-API messenger</Eyebrow>
        <Title>Сообщения</Title>
      </div>
      <Connection>
        <StatusDot $online={isConnected} />
        <span>{isConnected ? "Подключено" : "Ожидает подключения"}</span>
      </Connection>
      <TextOnly>Только текстовые сообщения</TextOnly>
      <SettingsButton
        type="button"
        onClick={onSettingsClick}
        aria-label="Открыть настройки"
      >
        •••
      </SettingsButton>
    </Header>
  );
}
