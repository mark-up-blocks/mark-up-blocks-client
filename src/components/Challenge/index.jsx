import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import Display from "./Display";
import DndInterface from "./DndInterface";

import {
  fetchChallenge, addChildTree, initializeStage, changeStage,
} from "../../features/challenge";
import { setError, setFinishPopup, setLoading } from "../../features/notice";
import { selectStageByParams } from "../../helpers/globalSelectors";
import { MESSAGE } from "../../constants";

function Challenge() {
  const dispatch = useDispatch();
  const { index, id } = useParams();
  const stage = useSelector((state) => selectStageByParams(state, { index: Number(index), id }));
  const canRender = stage.isValid && stage.isLoaded && stage.hasPreviousData && !stage.hasError;

  const handleDrop = ({
    itemId, containerId, index: containerIndex, prevContainerId,
  }) => {
    dispatch(addChildTree({
      challengeIndex: Number(index),
      itemId,
      containerId,
      containerIndex,
      prevContainerId,
      stageId: stage._id,
    }));
  };

  useEffect(() => {
    if (stage.isListLoading) {
      dispatch(setLoading({ message: MESSAGE.LOADING_LIST }));
      return;
    }

    if (stage.isChallengeLoading) {
      return;
    }

    if (stage.hasError) {
      dispatch(setError({ message: MESSAGE.CHALLENGE_NOT_FOUND }));
      return;
    }

    if (!stage.isValid) {
      dispatch(setError({ message: MESSAGE.INVALID_STAGE_ID, stageId: stage._id }));
      return;
    }

    if (stage.hasChanged) {
      dispatch(changeStage({ stageId: stage._id, index: Number(index) }));
    }

    if (!stage.isLoaded) {
      dispatch(fetchChallenge({ id: stage.challengeId }));
      return;
    }

    if (!stage.hasPreviousData && stage._id) {
      dispatch(initializeStage(stage._id));
      return;
    }

    if (stage.isCompleted) {
      dispatch(setFinishPopup({ stageId: stage._id, isFinalChallenge: false }));
    }
  }, [
    dispatch,
    stage.isListLoading,
    stage.isChallengeLoading,
    stage._id,
    stage.isValid,
    stage.isLoaded,
    stage.challengeId,
    stage.hasPreviousData,
    stage.hasChanged,
    stage.isCompleted,
    stage.hasError,
    index,
  ]);

  return (
    <ChallengeWrapper>
      {canRender && (
        <>
          <Display />
          <DndInterface onDrop={handleDrop} />
        </>
      )}
    </ChallengeWrapper>
  );
}

const ChallengeWrapper = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-rows: minmax(250px, 60vh) min(250px);

  @media screen and (max-width: ${({ theme }) => theme.screenSize.maxWidth.mobile}) {
    grid-template-rows: unset;
  }
`;

export default Challenge;
