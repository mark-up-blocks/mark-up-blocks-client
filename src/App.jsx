import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import styled, { ThemeProvider } from "styled-components";
import theme from "./theme";
import GlobalStyle from "./theme/global";

import { setChallenge } from "./features/challenge";
import { getChallenge } from "./api";
import ResultPage from "./components/ResultPage";
import TargetPage from "./components/TargetPage";
import TagBlockContainer from "./components/TagBlockContainer";
import HTMLViewer from "./components/HTMLViewer";

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
  const dispatch = useDispatch();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const challenge = await getChallenge("id");

        dispatch(setChallenge(challenge));
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.error(err);
        }

        setHasError(true);
      }
    }

    fetchData();
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <AppWrapper>
        {hasError
          ? <div>현재 사이트 이용이 불가능합니다.</div>
          : (
            <>
              <div>
                <ResultPage />
                <TargetPage />
              </div>
              <div>
                <TagBlockContainer />
                <HTMLViewer />
              </div>
            </>
          )}
      </AppWrapper>
      <GlobalStyle />
    </ThemeProvider>
  );
}

export default App;
