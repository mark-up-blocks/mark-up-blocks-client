import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useHistory } from "react-router-dom";

import styled, { ThemeProvider } from "styled-components";
import theme from "./theme";
import GlobalStyle from "./theme/global";

import { setStageInfo } from "./features/challenge";
import { getChallengeList } from "./api";
import Header from "./components/Header";
import Puzzle from "./components/Puzzle";
import Tutorial from "./components/Tutorial";
import { findNextUncompletedChallenge } from "./utils/selectData";

function App() {
  const dispatch = useDispatch();
  const history = useHistory();
  const challenge = useSelector((state) => state.challenge);
  const [isDone, setIsDone] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selectedOption] = useState(0);

  const handleMenuClick = (_id) => history.push(`/${_id}`);
  const notifyError = (err) => {
    if (process.env.NODE_ENV === "development") {
      console.error(err);
    }

    setHasError(true);
  };
  const handleFinishQuiz = (_id) => {
    const nextChallengeId = findNextUncompletedChallenge(
      challenge.stageInfo?.rootChallenge.data, _id,
    );

    if (nextChallengeId) {
      history.push(`/${nextChallengeId}`);
    } else {
      setIsDone(true);
    }
  };
  const handleTitleClick = () => {
    history.push("/");
    setHasError(false);
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
        <Header onMenuClick={handleMenuClick} onTitleClick={handleTitleClick} />
        {hasError
          ? <div>현재 사이트 이용이 불가능합니다.</div>
          : (
            <Switch>
              <Route exact path="/">
                <Tutorial onFinish={handleFinishQuiz} />
              </Route>
              <Route path="/:id">
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
