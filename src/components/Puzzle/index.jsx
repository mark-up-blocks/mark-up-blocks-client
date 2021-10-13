import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import Display from "./Display";
import DndInterface from "./DndInterface";
import ArrowButton from "../shared/Button/Arrow";

import { updateChallenge, addChildTree } from "../../features/challenge";
import { selectActiveChallenge } from "../../helpers/globalSelectors";

import { MESSAGE } from "../../constants";

function Puzzle({ notifyError, onFinish }) {
  const dispatch = useDispatch();
  const { index, id } = useParams();
  const {
    _id: challengeId, boilerplate, elementTree, tagBlockContainer, isCompleted,
  } = useSelector(selectActiveChallenge);
  const isLoading = !boilerplate || !elementTree;
  const handleDrop = ({
    itemId, containerId, index: containerIndex, prevContainerId,
  }) => {
    dispatch(addChildTree({
      itemId, containerId, index: containerIndex, prevContainerId,
    }));
  };

  useEffect(() => {
    if (id === challengeId) {
      return;
    }

    dispatch(updateChallenge({ index, subId: id, notifyError }));
  }, [dispatch, notifyError, id, index, challengeId]);

  return (
    <div>
      {isLoading
        ? <div>{MESSAGE.LOADING}</div>
        : (
          <div>
            <Display boilerplate={boilerplate} elementTree={elementTree} isDone={isCompleted} />
            {isCompleted
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
