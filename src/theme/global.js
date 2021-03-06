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
    font-family: sans-serif;
    background-color: ${theme.color.main};
    color: ${theme.color.inner};
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
    animation: 0.5s ease-in-out 0s infinite alternate blink;
  }

  .swing {
    animation: 0.15s ease-in-out 0s infinite alternate swing;
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
      background-color: ${theme.color.guide};
    }
  }


  @keyframes swing {
    0%, 25% {
      transform: rotate(0.3deg);
    }

    25%, 50% {
      transform: rotate(-0.3deg);
    }

    50%, 75% {
      transform: rotate(-0.7deg);
    }

    75%, 100% {
      transform: rotate(0.7deg);
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
