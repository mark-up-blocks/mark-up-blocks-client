import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import ResultPage from "./ResultPage";
import TargetPage from "./TargetPage";
import TagBlock from "./TagBlock";
import DropContainer from "./DropContainer";
import ArrowButton from "../shared/Button/Arrow";

import {
  setChallenge, markStageCompleted, addChildTree,
} from "../../features/challenge";
import { compareChildTreeIds, compareChildTreeByBlockIds } from "../../utils/selectData";

import { MESSAGE } from "../../constants";

function Puzzle({ notifyError, onFinish }) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { challengeId, tagBlocks, isCompleted } = useSelector((state) => state.challenge);
  const boilerplate = useSelector((state) => state.challenge.boilerplate, compareChildTreeIds);
  const answer = useSelector((state) => state.challenge.answer, compareChildTreeIds);
  const isCorrect = compareChildTreeByBlockIds(boilerplate, answer);
  const handleDrop = ({ itemId, containerId, index }) => {
    dispatch(addChildTree({ itemId, containerId, index }));
  };

  useEffect(() => {
    if (id === challengeId) {
      return;
    }

    dispatch(setChallenge({ id, notifyError }));
  }, [dispatch, notifyError, id, challengeId]);

  useEffect(() => {
    if (isCompleted) {
      return;
    }

    if (!isCorrect) {
      return;
    }

    if (!answer) {
      return;
    }

    dispatch(markStageCompleted());
  }, [dispatch, isCorrect, answer, isCompleted]);

  return (
    <div>
      <PageContainer hasSingleChild={isCorrect}>
        <ResultPage />
        {!isCorrect && <TargetPage />}
      </PageContainer>
      {isCorrect
        ? (
          <div>
            <MessageContainer>{MESSAGE.SUCCESS}</MessageContainer>
            <ArrowButton onClick={() => onFinish(id)} />
          </div>
        )
        : (
          <DndInterface>
            <TagBlockContainer>
              {tagBlocks.map(({
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
              {boilerplate ? (
                <DropContainer
                  _id={boilerplate._id}
                  childTrees={boilerplate.childTrees}
                  tagName={boilerplate.block.tagName}
                  onDrop={handleDrop}
                />
              ) : <div>로딩중</div>}
            </HTMLViewer>
          </DndInterface>
        )}
    </div>
  );
}

Puzzle.propTypes = {
  notifyError: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
};

export default Puzzle;

const PageContainer = styled.div`
  display: grid;
  grid-template-columns: ${({ hasSingleChild }) => (hasSingleChild ? "1fr" : "1fr 1fr")};
  margin: ${({ hasSingleChild }) => (hasSingleChild ? "0 auto" : "0")};
`;

export const DndInterface = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const MessageContainer = styled.pre`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const TagBlockContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 10px;
  justify-content: center;
  align-items: center;
  border: ${({ theme }) => theme.border.page};
`;

export const HTMLViewer = styled.div`
  display: grid;
  align-items: center;
  margin: 10px;
  border: ${({ theme }) => theme.border.page};
`;
