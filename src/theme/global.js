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

  .correct {
    border-radius: ${theme.border.radius.container};
    animation: 0.2s ease-in-out 0.1s 2 correctBlink;
  }

  .wrong {
    border-radius: ${theme.border.radius.container};
    animation: 0.2s ease-in-out 0.1s 2 errorBlink;
  }

  .grow-down {
    animation: 0.25s ease-in-out 0s 1 alternate growDown;
    transform-origin: top center;
  }

  @keyframes blink {
    to {
      background-color: transparent;
    }

    to {
      background-color: ${theme.color.dropGuide};
    }
  }

  @keyframes correctBlink {
    to {
      background-color: transparent;
      transform: scaleY(2);
    }

    to {
      background-color: ${theme.color.dropGuide};
      transform: scaleY(1);
    }
  }

  @keyframes errorBlink {
    to {
      background-color: transparent;
      transform: scaleY(2);
    }

    to {
      background-color: ${theme.color.errorBackground};
      transform: scaleY(1);
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

  @keyframes growDown {
    0% {
      transform: scaleY(0)
    }

    80% {
      transform: scaleY(1.1)
    }

    100% {
      transform: scaleY(1)
    }
  }
`;

export default GlobalStyle;
