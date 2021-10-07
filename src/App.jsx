import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import styled, { ThemeProvider } from "styled-components";
import theme from "./theme";
import GlobalStyle from "./theme/global";

import { setChallenge, setStageInfo, markStageCompleted } from "./features/challenge";
import { getChallengeList, getChallenge } from "./api";
import Header from "./components/Header";
import ResultPage from "./components/ResultPage";
import TargetPage from "./components/TargetPage";
import TagBlockContainer from "./components/TagBlockContainer";
import HTMLViewer from "./components/HTMLViewer";

import { compareChildTreeIds, compareChildTreeByBlockIds } from "./utils/selectData";
import { MESSAGE } from "./constants";

function App() {
  const dispatch = useDispatch();
  const [hasError, setHasError] = useState(false);
  const { challengeId, isLoaded } = useSelector((state) => state.challenge);
  const boilerplate = useSelector((state) => state.challenge.boilerplate, compareChildTreeIds);
  const answer = useSelector((state) => state.challenge.answer, compareChildTreeIds);
  const isCorrect = compareChildTreeByBlockIds(boilerplate, answer);
  const [selectedOption] = useState(0);

  useEffect(() => {
    async function fetchRootChallenge() {
      try {
        const { challenges } = await getChallengeList();
        const rootChallenge = challenges[selectedOption];

        dispatch(setStageInfo(rootChallenge));
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.error(err);
        }

        setHasError(true);
      }
    }

    fetchRootChallenge();
  }, [dispatch, selectedOption]);

  useEffect(() => {
    async function fetchChallenge() {
      try {
        const challenge = await getChallenge(challengeId);

        dispatch(setChallenge(challenge));
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.error(err);
        }

        setHasError(true);
      }
    }

    if (!challengeId || isLoaded) {
      return;
    }

    fetchChallenge();
  }, [dispatch, isLoaded, challengeId]);

  useEffect(() => {
    if (!isCorrect) {
      return;
    }

    dispatch(markStageCompleted());
  }, [dispatch, isCorrect]);

  return (
    <ThemeProvider theme={theme}>
      <AppWrapper>
        <Header />
        {hasError
          ? <div>현재 사이트 이용이 불가능합니다.</div>
          : (
            <>
              <PageContainer hasSingleChild={isCorrect}>
                <ResultPage />
                {!isCorrect && <TargetPage />}
              </PageContainer>
              {isCorrect
                ? <MessageContainer>{MESSAGE.SUCCESS}</MessageContainer>
                : (
                  <DndInterface>
                    <TagBlockContainer />
                    <HTMLViewer />
                  </DndInterface>
                )}
            </>
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

const PageContainer = styled.div`
  display: grid;
  grid-template-columns: ${({ hasSingleChild }) => (hasSingleChild ? "1fr" : "1fr 1fr")};
  margin: ${({ hasSingleChild }) => (hasSingleChild ? "0 auto" : "0")};
`;

const DndInterface = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const MessageContainer = styled.pre`
  display: flex;
  justify-content: center;
  align-items: center;
`;
