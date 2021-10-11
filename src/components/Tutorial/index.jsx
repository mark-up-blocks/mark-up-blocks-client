import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import DndInterface from "../Puzzle/DndInterface";

import Button from "../shared/Button";
import ArrowButton from "../shared/Button/Arrow";

import { sampleBlock, sampleBoilerplate } from "./tutorialData";
import { TYPE } from "../../constants";

function Tutorial({ onFinish }) {
  const [isDone, setIsDone] = useState(false);
  const [tutorialBlocks, setTutorialBlocks] = useState([sampleBlock]);
  const [boilerplate, setBoilerplate] = useState(sampleBoilerplate);
  const handleDrop = () => {
    setTutorialBlocks(() => [{
      ...sampleBlock,
      hasUsed: true,
    }]);
    setBoilerplate((prev) => ({ ...prev, childTrees: [sampleBlock] }));
    setIsDone(true);
  };
  const handleReset = () => {
    setIsDone(false);
    setTutorialBlocks([sampleBlock]);
    setBoilerplate(sampleBoilerplate);
  };

  return (
    <div>
      {isDone
        ? (
          <div>
            <p>좋아요 !</p>
            <Button onClick={handleReset} value="한번 더?" />
            <div>
              <span>다음 스테이지</span>
              <ArrowButton onClick={onFinish} />
            </div>
          </div>
        )
        : (
          <>
            <div>Mark Up Blocks에 오신 것을 환영합니다! 아래 태그 블록을 div 안으로 옮겨볼까요?</div>
            <WideDndInterface
              tagBlockContainer={{ _id: TYPE.TAG_BLOCK_CONTAINER, tagName: "div", childTrees: tutorialBlocks }}
              boilerplate={boilerplate}
              onDrop={handleDrop}
            />
          </>
        )}
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
