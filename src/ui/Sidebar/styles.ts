import styled from "styled-components";

export const Panel = styled.aside`
  position: relative;
  min-height: 0;
  overflow-y: auto;
  padding: 34px 28px;
  border-right: 1px solid #d6e4cb;
  background: #252525;

  @media (max-width: 700px) {
    overflow: visible;
    padding: 23px 18px 18px;
    border-right: 0;
    border-bottom: 1px solid #363d32;
  }
`;

export const Heading = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  margin-bottom: 28px;
  @media (max-width: 700px) {
    margin-bottom: 18px;
  }
`;

export const Count = styled.span`
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #3b9702;
  color: #f1f6ed;
  font-size: 12px;
`;

export const Form = styled.form`
  padding-bottom: 24px;
  border-bottom: 1px solid #363d32;
  @media (max-width: 700px) {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 8px;
    padding-bottom: 16px;
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #adbea5;
  font-size: 12px;
  font-weight: 700;
  @media (max-width: 700px) {
    grid-column: 1 / -1;
  }
`;

export const PhoneInput = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 14px;
  border: 1px solid #cfe0c1;
  border-radius: 8px;
  background: #1b1b1b;
  color: #adbea5;
  &:focus-within {
    border-color: #3b9702;
    box-shadow: 0 0 0 3px rgba(59, 151, 2, 0.14);
  }
`;

export const Input = styled.input`
  width: 100%;
  height: 44px;
  border: 0;
  outline: 0;
  font: inherit;
  appearance: none;
  color-scheme: dark;
  background: #1b1b1b !important;
  color: #edf4e9 !important;
  caret-color: #b7e59e;
  -webkit-text-fill-color: #edf4e9;
  font-size: 13px;
  &::placeholder {
    color: #91a18a;
    opacity: 1;
  }
  &:focus,
  &:active,
  &:autofill,
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus {
    background: #1b1b1b !important;
    color: #edf4e9 !important;
    -webkit-text-fill-color: #edf4e9;
    -webkit-box-shadow: 0 0 0 1000px #1b1b1b inset !important;
    box-shadow: 0 0 0 1000px #1b1b1b inset !important;
  }
  &::selection {
    background: #3b9702;
    color: #ffffff;
  }
`;

export const OpenButton = styled.button`
  width: 100%;
  height: 44px;
  margin-top: 10px;
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
  @media (max-width: 700px) {
    width: 44px;
    margin-top: 0;
    padding: 0;
    font-size: 0;
  }
`;

export const ChatPreview = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 18px;
  padding: 12px;
  border: 1px solid #3b9702;
  border-radius: 10px;
  background: #264500;
  text-align: left;
  cursor: pointer;
  @media (max-width: 700px) {
    margin-top: 12px;
  }
`;

export const ChatList = styled.div`
  display: grid;
  gap: 6px;
  margin-top: 18px;
`;

export const LoadingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  padding: 12px;
  border: 1px solid #d6e4cb;
  border-radius: 10px;
  background: #3b970233;
  color: #adbea5;
  font-size: 12px;
`;

export const Spinner = styled.span`
  width: 14px;
  height: 14px;
  border: 2px solid #b9d4a7;
  border-top-color: #3b9702;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const ChatCopy = styled.span`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 3px;
  strong {
    color: #edf4e9;
    font-size: 13px;
  }
  small {
    color: #adbea5;
    font-size: 11px;
  }
`;

export const Arrow = styled.span`
  color: #b7e59e;
  font-size: 22px;
`;

export const Empty = styled.div`
  display: grid;
  place-items: center;
  gap: 10px;
  margin-top: 54px;
  color: #82957a;
  text-align: center;
  font-size: 12px;
  line-height: 1.5;
  span {
    color: #3b9702;
    font-size: 23px;
  }
`;
