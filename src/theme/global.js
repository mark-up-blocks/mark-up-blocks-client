import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
  ${reset};

  html, body, #root {
    width: 100%;
    height: 100%;
  }

  * {
    font: inherit;
  }

  body {
    font-family: "Noto Serif KR";
  }

  a {
    text-decoration: none;
  }

  button {
    border: none;
    background-color: transparent;
    cursor: pointer;
  }

  @font-face {
    font-family: "Noto Sans Display";
    src: url("/font/NotoSansDisplay-Black.ttf");
  }

  @font-face {
    font-family: "Noto Serif KR";
    src: url("/font/NotoSerifKR-Light.otf");
  }
`;

export default GlobalStyle;
