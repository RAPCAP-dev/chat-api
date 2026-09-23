import type { FormEvent } from "react";
import styled from "styled-components";
import type { GreenApiCredentials } from "../types/chat";
import { Eyebrow } from "./styles";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 20;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.72);
`;
const Modal = styled.form`
  width: min(100%, 430px);
  padding: 30px;
  border-radius: 14px;
  background: #252525;
  box-shadow: 0 22px 60px rgba(14, 31, 27, 0.25);
`;
const Heading = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
`;
const Title = styled.h2`
  margin: 0;
  color: #f1f6ed;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 24px;
  font-weight: 400;
`;
const CloseButton = styled.button`
  border: 0;
  background: transparent;
  color: #758995;
  font-size: 27px;
  line-height: 1;
  cursor: pointer;
`;
const Description = styled.p`
  margin: 0 0 22px;
  color: #adbea5;
  font-size: 12px;
  line-height: 1.5;
`;
const Label = styled.label`
  display: block;
  margin: 15px 0 8px;
  color: #c7d8be;
  font-size: 12px;
  font-weight: 700;
`;
const Input = styled.input`
  width: 100%;
  height: 44px;
  box-sizing: border-box;
  padding: 0 12px;
  border: 1px solid #414a3c;
  border-radius: 7px;
  outline: 0;
  background: #1b1b1b;
  color: #edf4e9;
  font-size: 13px;
  &:focus {
    border-color: #3b9702;
    outline: 3px solid rgba(59, 151, 2, 0.14);
  }
`;
const SaveButton = styled.button`
  width: 100%;
  height: 44px;
  margin-top: 22px;
  border: 0;
  border-radius: 8px;
  background: #3b9702;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  &:hover {
    background: #2f7902;
  }
`;
type SettingsModalProps = {
  credentials: GreenApiCredentials;
  onCredentialsChange: (credentials: GreenApiCredentials) => void;
  onSave: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  onClose: () => void;
};

export function SettingsModal({
  credentials,
  onCredentialsChange,
  onSave,
  onClose,
}: SettingsModalProps) {
  return (
    <Backdrop onMouseDown={onClose}>
      <Modal onSubmit={onSave} onMouseDown={(event) => event.stopPropagation()}>
        <Heading>
          <div>
            <Eyebrow>Подключение</Eyebrow>
            <Title>Настройки GREEN-API</Title>
          </div>
          <CloseButton type="button" onClick={onClose} aria-label="Закрыть">
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
            onCredentialsChange({
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
            onCredentialsChange({
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
            onCredentialsChange({
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
