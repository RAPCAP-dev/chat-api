import styled from "styled-components";

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 20;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.72);
`;

export const Modal = styled.form`
  width: min(100%, 430px);
  padding: 30px;
  border-radius: 14px;
  background: #252525;
  box-shadow: 0 22px 60px rgba(14, 31, 27, 0.25);
`;

export const Heading = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const Title = styled.h2`
  margin: 0;
  color: #f1f6ed;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 24px;
  font-weight: 400;
`;

export const CloseButton = styled.button`
  border: 0;
  background: transparent;
  color: #758995;
  font-size: 27px;
  line-height: 1;
  cursor: pointer;
`;

export const Description = styled.p`
  margin: 0 0 22px;
  color: #adbea5;
  font-size: 12px;
  line-height: 1.5;
`;

export const Label = styled.label`
  display: block;
  margin: 15px 0 8px;
  color: #c7d8be;
  font-size: 12px;
  font-weight: 700;
`;

export const Input = styled.input`
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

export const SaveButton = styled.button`
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