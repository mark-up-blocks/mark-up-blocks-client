import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Redirect, Route, Switch, useHistory,
} from "react-router-dom";

import styled, { ThemeProvider } from "styled-components";
import theme from "./theme";
import GlobalStyle from "./theme/global";

import { fetchChallenges } from "./features/challenge";
import Tutorial from "./components/Tutorial";
import Header from "./components/Header";
import Puzzle from "./components/Puzzle";
import { findNextUncompletedChallenge } from "./helpers/blockTreeHandlers";
import route from "./route";
import { MESSAGE } from "./constants";

function App() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { isLoading, challenges, selectedIndex } = useSelector((state) => state.challenge);
  const [isDone, setIsDone] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleStageMenuClick = (_id) => history.push(route.selectedChallenge(selectedIndex, _id));
  const notifyError = (err) => {
    if (process.env.NODE_ENV === "development") {
      console.error(err);
    }

    setHasError(true);
  };
  const handleFinishQuiz = (_id) => {
    const nextSubChallengeId = findNextUncompletedChallenge(
      challenges[selectedIndex]?.elementTree, _id,
    );

    if (nextSubChallengeId) {
      history.push(route.selectedChallenge(selectedIndex, nextSubChallengeId));
      return;
    }

    if (selectedIndex + 1 >= challenges.length - 1) {
      history.push(route.nextIndex(selectedIndex));
      return;
    }

    setIsDone(true);
  };
  const handleTitleClick = () => {
    history.push(route.home);
    setHasError(false);
  };
  const handleChallengeClick = (index) => {
    if (index === selectedIndex) {
      return;
    }

    history.push(route.selectedPuzzle(index));
  };

  useEffect(() => {
    dispatch(fetchChallenges({ notifyError }));
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <AppWrapper>
        <Header
          onTitleClick={handleTitleClick}
          onStageMenuClick={handleStageMenuClick}
          onChallengeClick={handleChallengeClick}
        />
        {hasError || isLoading
          ? <div>{hasError ? MESSAGE.INTERNAL_SERVER_ERROR : MESSAGE.LOADING_CHALLENGE_LIST}</div>
          : (
            <Switch>
              <Route exact path={route.home}>
                <Redirect to={route.tutorial} />
              </Route>
              <Route path={route.tutorial}>
                <Tutorial
                  notifyError={notifyError}
                  onFinish={handleFinishQuiz}
                />
              </Route>
              <Route exact path={route.puzzle}>
                <Puzzle
                  notifyError={notifyError}
                  onFinish={handleFinishQuiz}
                />
              </Route>
              <Route path="*">
                <div>{MESSAGE.NOT_FOUND}</div>
              </Route>
            </Switch>
          )}
        {isDone && <div>{MESSAGE.ENDING}</div>}
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
