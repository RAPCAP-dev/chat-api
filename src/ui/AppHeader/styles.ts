import styled from "styled-components";

export const Header = styled.header`
  height: 68px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 48px;
  color: #f4f6ef;
  background: #264500;

  @media (max-width: 700px) {
    height: 68px;
    padding: 0 18px;
  }
`;

export const BrandMark = styled.div`
  width: 112px;
  display: flex;
  align-items: center;
  img {
    display: block;
    width: 112px;
    height: auto;
  }
`;

export const Title = styled.h1`
  margin: 0;
  color: inherit;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 25px;
  font-weight: 400;
  line-height: 1.1;

  @media (max-width: 700px) {
    font-size: 21px;
  }
`;

export const Connection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  padding: 7px 10px;
  border: 1px solid rgba(59, 151, 2, 0.24);
  border-radius: 999px;
  background: #dff0d5;
  color: #264500;
  font-size: 12px;

  @media (max-width: 700px) {
    display: none;
  }
`;

export const StatusDot = styled.span<{ $online: boolean }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ $online }) => ($online ? "#3b9702" : "#8fa77a")};
  box-shadow: ${({ $online }) =>
    $online ? "0 0 0 4px rgba(59, 151, 2, .22)" : "none"};
`;

export const SettingsButton = styled.button`
  width: 40px;
  height: 40px;
  margin-left: 14px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 50%;
  background: transparent;
  color: #e8f4df;
  cursor: pointer;
  letter-spacing: 2px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const TextOnly = styled.span`
  display: inline-flex;
  align-items: center;
  margin-left: auto;
  padding: 7px 10px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  color: #d7e8c4;
  font-size: 11px;
  @media (max-width: 700px) {
    display: none;
  }
`;
