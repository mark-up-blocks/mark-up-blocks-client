import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
  ${reset};

  html, body, #root {
    width: 100%;
    height: 100%;
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
    src: url("https://fonts.googleapis.com/css2?family=Noto+Sans+Display:wght@100&display=swap");
  }
`;

export default GlobalStyle;
