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
import { findNextUncompletedChallenge } from "./utils/selectData";

function App() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { isLoading, challenges, selectedIndex } = useSelector((state) => state.challenge);
  const [isDone, setIsDone] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleMenuClick = (_id) => history.push(`/${selectedIndex}/${_id}`);
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
      history.push(`/${selectedIndex}/${nextSubChallengeId}`);
      return;
    }

    if (selectedIndex + 1 >= challenges.length - 1) {
      dispatch(updateChallenge({ index: selectedIndex + 1, notifyError }));
      history.push(`/${selectedIndex + 1}`);
      return;
    }

    setIsDone(true);
  };
  const handleTitleClick = () => {
    history.push("/");
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
          ? <div>{hasError ? "현재 사이트 이용이 불가능합니다." : "챌린지 목록을 불러오는중..."}</div>
          : (
            <Switch>
              <Route exact path="/">
                <Tutorial onFinish={handleFinishQuiz} />
              </Route>
              <Route exact path="/:index/:id?">
                <Puzzle
                  notifyError={notifyError}
                  onFinish={handleFinishQuiz}
                />
              </Route>
              <Route path="*">
                <div>404 not found</div>
              </Route>
            </Switch>
          )}
        {isDone && <div>모두 완료하셨네요!!</div>}
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
