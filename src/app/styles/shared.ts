import { css } from 'styled-components';

export const fontFamily = css`
  font-family: var(--font-circular), -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
`;

export const headingStyles = css`
  ${fontFamily}
  font-weight: 700;
  background: linear-gradient(to right, #fff, #b3b3b3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const buttonStyles = css`
  ${fontFamily}
  font-weight: 600;
  transition: all 0.2s ease;
`; 