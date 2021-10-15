import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import DndInterface from "../Puzzle/DndInterface";
import FinishPopup from "../ModalTemplate/FinishPopup";

import { updateChallenge, addChildTree } from "../../features/challenge";

function Tutorial({ onFinish, notifyError }) {
  const dispatch = useDispatch();
  const { challenges } = useSelector((state) => state.challenge);
  const tutorialChallenge = challenges[0].elementTree;
  const { tagBlockContainer, boilerplate, isCompleted } = tutorialChallenge;
  const handleDrop = ({
    itemId, containerId, index, prevContainerId,
  }) => {
    dispatch(addChildTree({
      itemId, containerId, index, prevContainerId,
    }));
  };
  const handleFinish = () => onFinish(tutorialChallenge._id);

  useEffect(() => {
    dispatch(updateChallenge({ index: 0, notifyError }));
  }, [dispatch, notifyError]);

  return (
    <TutorialWrapper>
      <div>
        {isCompleted
          ? <FinishPopup onClick={handleFinish} />
          : (
            <Guide>
              <p className="welcome">Mark Up Blocks에 오신 것을 환영합니다!</p>
              <p className="guide-description">아래 태그 블록을 div 안으로 옮겨볼까요?</p>
            </Guide>
          )}
      </div>
      <DndInterface
        tagBlockContainer={tagBlockContainer}
        boilerplate={boilerplate}
        onDrop={handleDrop}
      />
    </TutorialWrapper>
  );
}

Tutorial.propTypes = {
  notifyError: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
};

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
