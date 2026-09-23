import styled from "styled-components";

export const Panel = styled.section`
  display: flex;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
  background: #202020;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 25px 34px;
  border-bottom: 1px solid #363d32;
  background: #252525;
  @media (max-width: 700px) {
    padding: 17px 18px;
  }
`;

export const HeaderCopy = styled.div`
  flex: 1;
  h2 {
    margin: 0;
    color: #f1f6ed;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 20px;
    font-weight: 400;
  }
  p {
    margin: 3px 0 0;
    color: #adbea5;
    font-size: 11px;
  }
`;

export const ProviderLabel = styled.span`
  color: #adbea5;
  font-size: 10px;
  letter-spacing: 0.7px;
  @media (max-width: 700px) {
    display: none;
  }
`;

export const Area = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 24px 9%;
  background: #202020;
  @media (max-width: 700px) {
    min-height: 300px;
    padding: 18px;
  }
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 4px 0 25px;
  color: #aab9a3;
  font-size: 11px;
  &::before,
  &::after {
    flex: 1;
    height: 1px;
    background: #3b4a32;
    content: "";
  }
`;

export const Row = styled.article<{ $outgoing: boolean }>`
  display: flex;
  justify-content: ${({ $outgoing }) =>
    $outgoing ? "flex-end" : "flex-start"};
  margin: 11px 0;
`;

export const Bubble = styled.div<{ $outgoing: boolean }>`
  max-width: min(480px, 78%);
  padding: 12px 15px 8px;
  border: 1px solid ${({ $outgoing }) => ($outgoing ? "#3b9702" : "#3b4a32")};
  border-radius: ${({ $outgoing }) =>
    $outgoing ? "14px 4px 14px 14px" : "4px 14px 14px 14px"};
  background: ${({ $outgoing }) => ($outgoing ? "#3b970266" : "#2b2b2b")};
  box-shadow: 0 3px 12px rgba(55, 79, 67, 0.035);
  p {
    margin: 0;
    color: #edf4e9;
    font-size: 13px;
    line-height: 1.55;
    overflow-wrap: anywhere;
  }
  footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 5px;
    margin-top: 5px;
    color: #aab9a3;
    font-size: 10px;
  }
`;

export const Status = styled.span<{ $error?: boolean }>`
  color: ${({ $error }) => ($error ? "#ee927f" : "#b7e59e")};
  letter-spacing: -2px;
`;

export const Composer = styled.form`
  display: flex;
  gap: 12px;
  padding: 18px 9% 25px;
  border-top: 1px solid #363d32;
  background: #252525;
  @media (max-width: 700px) {
    padding: 12px 18px 17px;
  }
`;

export const MessageInput = styled.textarea`
  flex: 1;
  min-height: 46px;
  max-height: 180px;
  height: 46px;
  padding: 12px 16px;
  border: 1px solid #414a3c;
  border-radius: 8px;
  outline: 0;
  resize: none;
  overflow-y: auto;
  font: inherit;
  background: #1b1b1b;
  color: #edf4e9;
  font-size: 13px;
  line-height: 22px;
  &::placeholder {
    color: #91a18a;
  }
  &:focus {
    border-color: #3b9702;
    box-shadow: 0 0 0 3px rgba(59, 151, 2, 0.14);
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`;

export const SendButton = styled.button`
  width: 46px;
  height: 46px;
  border: 0;
  border-radius: 8px;
  background: #3b9702;
  color: #e8f6ff;
  font-size: 20px;
  cursor: pointer;
  &:disabled {
    background: #3a4237;
    color: #91a18a;
    cursor: not-allowed;
  }
`;