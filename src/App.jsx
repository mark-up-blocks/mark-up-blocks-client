import React from "react";
import styled, { ThemeProvider } from "styled-components";
import theme from "./theme";
import GlobalStyle from "./theme/global";

const AppWrapper = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-rows: 2fr 1fr;

  & > div {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppWrapper>
        <div>
          <div>current page</div>
          <div>target page</div>
        </div>
        <div>
          <div>tag blocks</div>
          <div>HTML viewer</div>
        </div>
      </AppWrapper>
      <GlobalStyle />
    </ThemeProvider>
  );
}

export default App;
