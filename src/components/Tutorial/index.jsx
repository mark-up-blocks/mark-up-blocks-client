import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

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
    <Grid>
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
            <div className="grid">
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
            </div>
          </>
        )}
    </Grid>
  );
}

Tutorial.propTypes = {
  onFinish: PropTypes.func.isRequired,
};

export default Tutorial;

const Grid = styled.div`
  display: grid;
  width: 80%;
  height: 80%;

  .grid {
    display: grid;
    width: 100%;
    height: 100%;
    margin: auto;
    grid-template-columns: 1fr 1fr;
  }

  .preview-container {
    width: 200px;
    height: 100px;
  }
`;

const TagBlockContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 10px;
  justify-content: center;
  align-items: center;
  border: ${({ theme }) => theme.border.page};
`;

const HTMLViewer = styled.div`
  display: grid;
  align-items: center;
  margin: 10px;
  border: ${({ theme }) => theme.border.page};
`;
