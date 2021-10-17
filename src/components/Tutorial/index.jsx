import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import DndInterface from "../Challenge/DndInterface";

import { addChildTree } from "../../features/challenge";
import { setFinishPopup } from "../../features/notice";
import { selectStageByParams } from "../../helpers/globalSelectors";

function Tutorial() {
  const dispatch = useDispatch();
  const stage = useSelector((state) => selectStageByParams(state, { index: 0, id: "tutorialTree" }));
  const handleDrop = ({
    itemId, containerId, prevContainerId,
  }) => {
    dispatch(addChildTree({
      itemId, containerId, index: 0, prevContainerId, stageId: stage._id,
    }));
  };

  useEffect(() => {
    if (stage.isCompleted) {
      dispatch(setFinishPopup({ stageId: stage._id, isFinalChallenge: false }));
    }
  }, [
    dispatch,
    stage._id,
    stage.isCompleted,
  ]);

  return (
    <TutorialWrapper>
      <div>
        <Guide>
          <p className="welcome">Mark Up Blocks에 오신 것을 환영합니다!</p>
          <p className="guide-description">아래 태그 블록을 div 안으로 옮겨볼까요?</p>
        </Guide>
      </div>
      <DndInterface
        tagBlockContainer={stage.tagBlockContainer}
        boilerplate={stage.boilerplate}
        onDrop={handleDrop}
      />
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
`;
