import styled from 'styled-components'

export const Eyebrow = styled.p`
  margin: 0 0 2px;
  color: #71846a;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.4px;
  line-height: 1.2;
  text-transform: uppercase;
`

export const SerifHeading = styled.h2`
  margin: 0;
  color: #f1f6ed;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 28px;
  font-weight: 400;
  letter-spacing: -0.5px;
`

export const Avatar = styled.span<{ $large?: boolean }>`
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: ${({ $large }) => ($large ? '46px' : '38px')};
  height: ${({ $large }) => ($large ? '46px' : '38px')};
  border-radius: 50%;
  background: #3b9702;
  color: #f1f6ed;
  font-size: 11px;
  font-weight: 800;
`
