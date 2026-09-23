import styled from "styled-components";

export const AppWrapper = styled.main`
  min-height: 100svh;
  background: #1a1a1a;
  color: #264500;
`;

export const Workspace = styled.section`
  display: grid;
  grid-template-columns: minmax(270px, 31%) 1fr;
  max-width: 1360px;
  height: calc(100svh - 68px);
  margin: 0 auto;
  overflow: hidden;
  background: #202020;
  box-shadow: 0 20px 60px rgba(26, 48, 43, 0.08);

  @media (max-width: 700px) {
    display: block;
    height: auto;
    min-height: calc(100svh - 60px);
    overflow: visible;
  }
`;

export const Notice = styled.div`
  position: fixed;
  right: 24px;
  top: 110px;
  z-index: 10;
  padding: 13px 17px;
  border: 1px solid #b8d9ec;
  border-radius: 9px;
  background: #26351f;
  color: #e7f5df;
  font-size: 12px;
  box-shadow: 0 12px 30px rgba(28, 52, 42, 0.12);
`;

export const Eyebrow = styled.p`
  margin: 0 0 2px;
  color: #71846a;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.4px;
  line-height: 1.2;
  text-transform: uppercase;
`;

export const SerifHeading = styled.h2`
  margin: 0;
  color: #f1f6ed;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 28px;
  font-weight: 400;
  letter-spacing: -0.5px;
`;

export const Avatar = styled.span<{ $large?: boolean }>`
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: ${({ $large }) => ($large ? "46px" : "38px")};
  height: ${({ $large }) => ($large ? "46px" : "38px")};
  border-radius: 50%;
  background: #3b9702;
  color: #f1f6ed;
  font-size: 11px;
  font-weight: 800;
`;
