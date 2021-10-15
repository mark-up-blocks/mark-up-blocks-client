import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import theme from "./index";

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

  .drop-guide {
    animation: 0.3s ease-in-out 0s infinite alternate blink;
  }

  .drop-selected {
    background-color: ${theme.color.point};
  }

  .swing {
    animation: 0.15s ease-in-out 0s infinite alternate swing;
  }

  .swing:hover {
    animation: none;
  }

  @font-face {
    font-family: "Noto Sans Display";
    src: url("/font/NotoSansDisplay-Black.ttf");
  }

  @font-face {
    font-family: "Noto Serif KR";
    src: url("/font/NotoSerifKR-Light.otf");
  }

  @keyframes blink {
    to {
      background-color: transparent;
    }

    to {
      background-color: ${theme.color.dropGuide};
    }
  }

  @keyframes swing {
    0%, 25% {
      transform: rotate(0.5deg);
    }

    25%, 50% {
      transform: rotate(-0.5deg);
    }

    50%, 75% {
      transform: rotate(-1deg);
    }

    75%, 100% {
      transform: rotate(1deg);
    }
  }
`;

export default GlobalStyle;
