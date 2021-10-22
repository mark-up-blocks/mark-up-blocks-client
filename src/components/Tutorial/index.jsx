import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import Display from "../Challenge/Display";
import DndInterface from "../Challenge/DndInterface";

import { addChildTree, changeStage, initializeStage } from "../../features/challenge";
import { setError, setFinishPopup } from "../../features/notice";
import { selectStageByParams } from "../../helpers/globalSelectors";
import { MESSAGE } from "../../constants";

function Tutorial() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const stage = useSelector((state) => selectStageByParams(state, { index: 0, id }));
  const handleDrop = ({
    itemId, containerId, index: containerIndex, prevContainerId,
  }) => {
    dispatch(addChildTree({
      challengeIndex: 0,
      itemId,
      containerId,
      containerIndex,
      prevContainerId,
      stageId: stage._id,
    }));
  };
  const isInOrderStage = stage._id === "tutorial-in-order";

  useEffect(() => {
    const notifyError = (err) => dispatch(setError(err));

    if (!stage.isValid) {
      notifyError({ message: MESSAGE.INVALID_STAGE_ID, stageId: stage._id });
      return;
    }

    if (stage.hasChanged) {
      dispatch(changeStage({ stageId: stage._id, index: 0 }));
    }

    if (!stage.hasPreviousData) {
      dispatch(initializeStage(stage._id));
      return;
    }

    if (stage.isCompleted) {
      dispatch(setFinishPopup({ stageId: stage._id, isFinalChallenge: false }));
    }
  }, [
    dispatch,
    stage._id,
    stage.hasChanged,
    stage.hasPreviousData,
    stage.isCompleted,
    stage.isValid,
  ]);

  return (
    <TutorialWrapper>
      <div>
        {isInOrderStage
          ? (
            <>
              <Guide>
                <p className="guide-description">이제 블록을 움직여서 신호등을 만들어볼까요?</p>
                <p className="note">(블록을 클릭하면 어떻게 생겼는지 알 수 있어요!)</p>
              </Guide>
              {stage.hasPreviousData && (
                <Display boilerplate={stage.boilerplate} elementTree={stage.elementTree} />
              )}
            </>
          )
          : (
            <Guide>
              <p className="welcome">Mark Up Blocks에 오신 것을 환영합니다!</p>
              <p className="guide-description">아래 태그 블록을 div 안으로 옮겨볼까요?</p>
              <p className="note">(드래그가 어렵다면 블록을 클릭하고 div 안을 클릭해보세요!)</p>
            </Guide>
          )}
      </div>
      {stage.hasPreviousData && (
      <DndInterface
        tagBlockContainer={stage.tagBlockContainer}
        boilerplate={stage.boilerplate}
        onDrop={handleDrop}
      />
      )}
    </TutorialWrapper>
  );
}

export default Tutorial;

const TutorialWrapper = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-rows: 2fr 3fr;
  align-items: center;
`;

const Guide = styled.div`
  margin: 10px;
  padding: 10px;
  text-align: center;

  .welcome {
    margin: 10px;
    font-size: 1rem;
  }

  .guide-description {
    font-size: 1.15rem;
  }

  .note {
    margin-top: 10px;
    font-size: 0.8rem;
  }
`;
