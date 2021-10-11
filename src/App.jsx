import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useHistory } from "react-router-dom";

import styled, { ThemeProvider } from "styled-components";
import theme from "./theme";
import GlobalStyle from "./theme/global";

import { fetchChallenges, updateChallenge } from "./features/challenge";
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

  const handleMenuClick = (_id) => history.push(route.selectedChallenge(selectedIndex, _id));
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
      dispatch(updateChallenge({ index: selectedIndex + 1, notifyError }));
      history.push(route.nextIndex(selectedIndex));
      return;
    }

    setIsDone(true);
  };
  const handleTitleClick = () => {
    history.push(route.home);
    setHasError(false);
  };

  useEffect(() => {
    dispatch(fetchChallenges({ notifyError }));
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <AppWrapper>
        <Header onMenuClick={handleMenuClick} onTitleClick={handleTitleClick} />
        {hasError || isLoading
          ? <div>{hasError ? MESSAGE.INTERNAL_SERVER_ERROR : MESSAGE.LOADING_CHALLENGE_LIST}</div>
          : (
            <Switch>
              <Route exact path={route.home}>
                <Tutorial onFinish={handleFinishQuiz} />
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
