import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import Display from "./Display";
import DndInterface from "./DndInterface";
import FinishPopup from "../ModalTemplate/FinishPopup";

import { updateChallenge, addChildTree } from "../../features/challenge";
import { selectActiveChallenge } from "../../helpers/globalSelectors";

import { MESSAGE } from "../../constants";

function Puzzle({ notifyError, onFinish }) {
  const dispatch = useDispatch();
  const { index, id } = useParams();
  const { selectedIndex } = useSelector((state) => state.challenge);
  const {
    _id: challengeId, boilerplate, elementTree, tagBlockContainer, isCompleted, isLoaded,
  } = useSelector(selectActiveChallenge);
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
    <PuzzleWrapper>
      {isLoaded && String(selectedIndex) === index
        ? (
          <div>
            <Display boilerplate={boilerplate} elementTree={elementTree} />
            <DndInterface
              tagBlockContainer={tagBlockContainer}
              boilerplate={boilerplate}
              onDrop={handleDrop}
            />
          </div>
        )
        : <div>{MESSAGE.LOADING}</div>}
      {isCompleted && <FinishPopup onClick={() => onFinish(id)} />}
    </PuzzleWrapper>
  );
}

Puzzle.propTypes = {
  notifyError: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
};

export default Puzzle;

const PuzzleWrapper = styled.div`
  display: grid;
  grid-template-rows: 4fr 3fr;
`;
