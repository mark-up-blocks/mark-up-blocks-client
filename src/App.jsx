import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch, useHistory } from "react-router-dom";

import styled, { ThemeProvider } from "styled-components";
import theme from "./theme";
import GlobalStyle from "./theme/global";

import { setStageInfo } from "./features/challenge";
import { getChallengeList } from "./api";
import Header from "./components/Header";
import Puzzle from "./components/Puzzle";

function App() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [hasError, setHasError] = useState(false);
  const [selectedOption] = useState(0);

  const handleMenuClick = (_id) => history.push(`/${_id}`);
  const notifyError = (err) => {
    if (process.env.NODE_ENV === "development") {
      console.error(err);
    }

    setHasError(true);
  };

  useEffect(() => {
    async function fetchRootChallenge() {
      try {
        const { challenges } = await getChallengeList();
        const rootChallenge = challenges[selectedOption];

        dispatch(setStageInfo(rootChallenge));
      } catch (err) {
        notifyError(err);
      }
    }

    fetchRootChallenge();
  }, [dispatch, selectedOption]);

  return (
    <ThemeProvider theme={theme}>
      <AppWrapper>
        <Header onMenuClick={handleMenuClick} />
        {hasError
          ? <div>현재 사이트 이용이 불가능합니다.</div>
          : (
            <Switch>
              <Route path="/:id">
                <Puzzle notifyError={notifyError} />
              </Route>
              <Route path="*">
                <div>404 not found</div>
              </Route>
            </Switch>
          )}
      </AppWrapper>
      <GlobalStyle />
    </ThemeProvider>
  );
}

export default App;

const AppWrapper = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-rows: 50px 4fr 3fr;
`;
