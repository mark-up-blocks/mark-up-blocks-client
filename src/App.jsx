import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Route, Routes, useNavigate, Navigate,
} from "react-router-dom";

import styled, { ThemeProvider } from "styled-components";
import theme from "./theme";
import GlobalStyle from "./theme/global";

import { fetchChallenge, fetchChallengeList, resetChallenges } from "./features/challenge";
import {
  clearStatus, setError, setFinishPopup, setLoading,
} from "./features/notice";
import Tutorial from "./components/Tutorial";
import Header from "./components/Header";
import Challenge from "./components/Challenge";
import NoticeModal from "./components/NoticeModal";

import { findNextUncompletedChallenge } from "./helpers/blockTreeHandlers";
import route from "./route";
import { MESSAGE, TYPE } from "./constants";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const challenge = useSelector((state) => state.challenge);
  const notice = useSelector((state) => state.notice);
  const {
    isListLoading, isChallengeLoading, challenges, selectedIndex,
  } = challenge;

  const handleStageMenuClick = (_id) => navigate(route.selectedChallenge(selectedIndex, _id));
  const handleFinishQuiz = (stageId) => {
    const nextStageId = findNextUncompletedChallenge(
      challenges[selectedIndex]?.elementTree, stageId,
    );
    const hasRemainingChallenge = challenges.length - 1 >= selectedIndex + 1;

    if (isListLoading) {
      dispatch(setLoading({ message: MESSAGE.LOADING_LIST }));
      return;
    }

    if (hasRemainingChallenge) {
      const nextChallenge = challenge.challenges[selectedIndex + 1];

      if (!nextChallenge.isLoaded) {
        dispatch(fetchChallenge({ id: nextChallenge._id }));
      }
    }

    if (nextStageId) {
      navigate(route.selectedChallenge(selectedIndex, nextStageId));
      dispatch(clearStatus());
      return;
    }

    if (hasRemainingChallenge) {
      navigate(route.nextIndex(selectedIndex));
      dispatch(clearStatus());
      return;
    }

    dispatch(setFinishPopup({ isFinalChallenge: true }));
  };
  const handleReset = () => {
    navigate(route.home);
    dispatch(clearStatus());
  };
  const handleRestart = () => {
    navigate(route.home);
    dispatch(clearStatus());
    dispatch(resetChallenges());
  };
  const handleChallengeClick = (index) => {
    if (index === selectedIndex) {
      return;
    }

    navigate(route.selectedPuzzle(index));
  };

  useEffect(() => {
    const notifyError = (err) => {
      if (process.env.NODE_ENV === "development") {
        console.error(err);
      }

      dispatch(setError({ message: MESSAGE.INTERNAL_SERVER_ERROR, needPreventClear: true }));
    };

    if (isListLoading) {
      dispatch(fetchChallengeList({ notifyError }));
      return;
    }

    if (isChallengeLoading) {
      dispatch(setLoading({ message: MESSAGE.LOADING_CHALLENGE }));
      return;
    }

    if (notice.status === TYPE.LOADING && !isListLoading && !isChallengeLoading) {
      dispatch(clearStatus());
    }
  }, [dispatch, isListLoading, isChallengeLoading, notice.status]);

  return (
    <ThemeProvider theme={theme}>
      <AppWrapper>
        <Header
          onTitleClick={handleReset}
          onStageMenuClick={handleStageMenuClick}
          onChallengeClick={handleChallengeClick}
        />
        {notice.status && (
        <NoticeModal
          onFinish={handleFinishQuiz}
          onReset={handleReset}
          onRestart={handleRestart}
        />
        )}
        {!notice.needPreventRender
          && (
          <Routes>
            <Route path="/" element={<Navigate to={route.tutorialMain} />} />
            <Route path={route.tutorialMain} element={<Tutorial />} />
            <Route path={route.tutorial} element={<Tutorial />} />
            <Route path={route.puzzleMain} element={<Challenge />} />
            <Route path={route.puzzle} element={<Challenge />} />
            <Route path="*" element={<div>{MESSAGE.NOT_FOUND}</div>} />
          </Routes>
          )}
      </AppWrapper>
      <GlobalStyle />
    </ThemeProvider>
  );
}

const AppWrapper = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-rows: 50px auto;
`;

export default App;
