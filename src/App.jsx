import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Redirect, Route, Switch, useHistory,
} from "react-router-dom";

import styled, { ThemeProvider } from "styled-components";
import theme from "./theme";
import GlobalStyle from "./theme/global";

import { fetchChallengeList } from "./features/challenge";
import {
  clearStatus, setError, setFinishPopup, setLoading,
} from "./features/notice";
import Tutorial from "./components/Tutorial";
import Header from "./components/Header";
import Challenge from "./components/Challenge";
import NoticeModal from "./components/NoticeModal";

import { findNextUncompletedChallenge } from "./helpers/blockTreeHandlers";
import route from "./route";
import { MESSAGE } from "./constants";

function App() {
  const dispatch = useDispatch();
  const history = useHistory();
  const challenge = useSelector((state) => state.challenge);
  const notice = useSelector((state) => state.notice);
  const {
    isListLoading, isChallengeLoading, challenges, selectedIndex,
  } = challenge;

  const handleStageMenuClick = (_id) => history.push(route.selectedChallenge(selectedIndex, _id));
  const handleFinishQuiz = (stageId) => {
    const nextStageId = findNextUncompletedChallenge(
      challenges[selectedIndex]?.elementTree, stageId,
    );
    const hasRemainingChallenge = challenges.length - 1 >= selectedIndex + 1;

    if (isListLoading) {
      dispatch(setLoading({ message: MESSAGE.LOADING_LIST }));
      return;
    }

    if (nextStageId) {
      history.push(route.selectedChallenge(selectedIndex, nextStageId));
      dispatch(clearStatus());
      return;
    }

    if (hasRemainingChallenge) {
      history.push(route.nextIndex(selectedIndex));
      dispatch(clearStatus());
      return;
    }

    dispatch(setFinishPopup({ isFinalChallenge: true }));
  };
  const handleReset = () => {
    history.push(route.home);
    dispatch(clearStatus());
  };
  const handleChallengeClick = (index) => {
    if (index === selectedIndex) {
      return;
    }

    history.push(route.selectedPuzzle(index));
  };

  useEffect(() => {
    const notifyError = (err) => {
      dispatch(setError(err));
    };

    if (isListLoading) {
      dispatch(fetchChallengeList({ notifyError }));
      return;
    }

    if (isChallengeLoading) {
      return;
    }

    dispatch(clearStatus());
  }, [dispatch, isListLoading, isChallengeLoading]);

  return (
    <ThemeProvider theme={theme}>
      <AppWrapper>
        <Header
          onTitleClick={handleReset}
          onStageMenuClick={handleStageMenuClick}
          onChallengeClick={handleChallengeClick}
        />
        {notice.status && <NoticeModal onFinish={handleFinishQuiz} onReset={handleReset} />}
        {!notice.needPreventRender
          && (
          <Switch>
            <Route exact path={route.home}>
              <Redirect to={route.tutorial} />
            </Route>
            <Route path={route.tutorial}>
              <Tutorial />
            </Route>
            <Route exact path={route.puzzle}>
              <Challenge />
            </Route>
            <Route path="*">
              <div>{MESSAGE.NOT_FOUND}</div>
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
  grid-template-rows: 50px auto;
`;
