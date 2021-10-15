import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import Display from "./Display";
import DndInterface from "./DndInterface";
import FinishPopup from "../ModalTemplate/FinishPopup";
import Loading from "../ModalTemplate/Loading";
import Button from "../shared/Button";

import { updateChallenge, addChildTree, resetStage } from "../../features/challenge";
import { selectActiveChallenge } from "../../helpers/globalSelectors";

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
  const handleReset = () => dispatch(resetStage());

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
          <>
            <Display boilerplate={boilerplate} elementTree={elementTree} />
            <DndInterface
              tagBlockContainer={tagBlockContainer}
              boilerplate={boilerplate}
              onDrop={handleDrop}
            />
            <ResetButton value="reset" onClick={handleReset} />
          </>
        )
        : <Loading />}
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
  width: 100%;
  height: 100%;
  margin-bottom: 20px;
  grid-template-rows: 60% minmax(40%, 100px);

  @media screen and (max-width: ${({ theme }) => theme.screenSize.maxWidth.mobile}), {
    grid-template-rows: unset;
  }
`;

const ResetButton = styled(Button)`
  position: fixed;
  top: 100%;
  left: 100%;
  margin-top: -50px;
  margin-left: -90px;
  width: 80px;
  height: 40px;
  border-radius: 2px;
  background-color: ${({ theme }) => theme.color.focus};

  :hover {
    background-color: ${({ theme }) => theme.color.main};
  }
`;
