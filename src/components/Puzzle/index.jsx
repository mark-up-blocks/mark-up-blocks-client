import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import Display from "./Display";
import DndInterface from "./DndInterface";
import ArrowButton from "../shared/Button/Arrow";

import { setChallenge, markStageCompleted, addChildTree } from "../../features/challenge";
import { compareChildTreeIds, compareChildTreeByBlockIds } from "../../utils/selectData";

import { MESSAGE } from "../../constants";

function Puzzle({ notifyError, onFinish }) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { challengeId, tagBlockContainer, isCompleted } = useSelector((state) => state.challenge);
  const boilerplate = useSelector((state) => state.challenge.boilerplate, compareChildTreeIds);
  const answer = useSelector((state) => state.challenge.answer, compareChildTreeIds);
  const isCorrect = compareChildTreeByBlockIds(boilerplate, answer);
  const isLoading = !boilerplate || !answer;
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
      {isLoading
        ? <div>{MESSAGE.LOADING}</div>
        : (
          <div>
            <Display boilerplate={boilerplate} answer={answer} isDone={isCorrect} />
            {isCorrect
              ? (
                <div>
                  <MessageContainer>{MESSAGE.SUCCESS}</MessageContainer>
                  <ArrowButton onClick={() => onFinish(id)} />
                </div>
              )
              : (
                <DndInterface
                  tagBlockContainer={tagBlockContainer}
                  boilerplate={boilerplate}
                  onDrop={handleDrop}
                />
              )}
          </div>
        )}
    </div>
  );
}

Puzzle.propTypes = {
  notifyError: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
};

export default Puzzle;

const MessageContainer = styled.pre`
  display: flex;
  justify-content: center;
  align-items: center;
`;
