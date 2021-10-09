import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { DndInterface, TagBlockContainer, HTMLViewer } from "../Puzzle";

import DropContainer from "../Puzzle/DropContainer";
import TagBlock from "../Puzzle/TagBlock";
import ArrowButton from "../Button/Arrow";

const sampleBlock = {
  _id: "tutorial1",
  block: {
    _id: "tutorial1",
    tagName: "p",
    isContainer: false,
    property: {
      text: "Move me",
      style: {
        width: "100px",
        height: "30px",
        backgroundColor: "gold",
      },
    },
  },
  hasUsed: false,
  isChallenge: false,
};

function Tutorial({ onFinish }) {
  const [isDone, setIsDone] = useState(false);
  const [tutorialBlocks, setTutorialBlocks] = useState([sampleBlock]);
  const [childTrees, setChildTrees] = useState([]);
  const handleDrop = () => {
    setTutorialBlocks(() => [{
      ...sampleBlock,
      hasUsed: true,
    }]);
    setChildTrees([sampleBlock]);
    setIsDone(true);
  };
  const handleReset = () => {
    setIsDone(false);
    setTutorialBlocks([sampleBlock]);
    setChildTrees([]);
  };

  return (
    <div>
      {isDone
        ? (
          <div>
            <p>좋아요 !</p>
            <button type="button" onClick={handleReset}>한번 더?</button>
            <div className="grid">
              <span>다음 스테이지</span>
              <ArrowButton onClick={onFinish} />
            </div>
          </div>
        )
        : (
          <>
            <div>Mark Up Blocks에 오신 것을 환영합니다! 아래 태그 블록을 div 안으로 옮겨볼까요?</div>
            <WideDndInterface>
              <TagBlockContainer>
                {tutorialBlocks.map(({
                  _id, block, hasUsed, isChallenge,
                }) => (
                  !hasUsed && (
                  <TagBlock
                    key={_id}
                    _id={_id}
                    block={block}
                    isChallenge={isChallenge}
                  />
                  )
                ))}
              </TagBlockContainer>
              <HTMLViewer>
                <DropContainer
                  _id="tutorialBox"
                  tagName="div"
                  childTrees={childTrees}
                  onDrop={handleDrop}
                />
              </HTMLViewer>
            </WideDndInterface>
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
