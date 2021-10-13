import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import DndInterface from "../Puzzle/DndInterface";

import ArrowButton from "../shared/Button/Arrow";

import { addChildTree } from "../../features/challenge";

function Tutorial({ onFinish }) {
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

  return (
    <div>
      {isCompleted ? (
        <div>
          <p>좋아요 !</p>
          <div>
            <span>다음 스테이지</span>
            <ArrowButton onClick={onFinish} />
          </div>
        </div>
      ) : <div>Mark Up Blocks에 오신 것을 환영합니다! 아래 태그 블록을 div 안으로 옮겨볼까요?</div>}
      <WideDndInterface
        tagBlockContainer={tagBlockContainer}
        boilerplate={boilerplate}
        onDrop={handleDrop}
      />
    </div>
  );
}

Tutorial.propTypes = {
  onFinish: PropTypes.func.isRequired,
};

export default Tutorial;

const WideDndInterface = styled(DndInterface)`
  width: 100%;
  height: 100%;
`;
