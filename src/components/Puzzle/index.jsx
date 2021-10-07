import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import ResultPage from "./ResultPage";
import TargetPage from "./TargetPage";
import TagBlock from "./TagBlock";
import DropContainer from "./DropContainer";

import { setChallenge, markStageCompleted, addChildTree } from "../../features/challenge";
import { getChallenge } from "../../api";
import { compareChildTreeIds, compareChildTreeByBlockIds } from "../../utils/selectData";

import { MESSAGE } from "../../constants";

function Puzzle({ notifyError }) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { challengeId } = useSelector((state) => state.challenge);
  const { tagBlocks } = useSelector((state) => state.challenge);
  const boilerplate = useSelector((state) => state.challenge.boilerplate, compareChildTreeIds);
  const answer = useSelector((state) => state.challenge.answer, compareChildTreeIds);
  const isCorrect = compareChildTreeByBlockIds(boilerplate, answer);
  const handleDrop = ({ itemId, containerId, index }) => {
    dispatch(addChildTree({ itemId, containerId, index }));
  };

  useEffect(() => {
    async function fetchChallenge() {
      try {
        const challenge = await getChallenge(id);

        dispatch(setChallenge(challenge));
      } catch (err) {
        notifyError(err);
      }
    }

    if (id === challengeId) {
      return;
    }

    fetchChallenge();
  }, [dispatch, notifyError, id, challengeId]);

  useEffect(() => {
    if (!isCorrect) {
      return;
    }

    dispatch(markStageCompleted());
  }, [dispatch, isCorrect]);

  return (
    <div>
      <PageContainer hasSingleChild={isCorrect}>
        <ResultPage />
        {!isCorrect && <TargetPage />}
      </PageContainer>
      {isCorrect
        ? <MessageContainer>{MESSAGE.SUCCESS}</MessageContainer>
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
};

export default Puzzle;

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
