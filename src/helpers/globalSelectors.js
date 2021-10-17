import { findBlockTreeById } from "./blockTreeHandlers";
import { TYPE } from "../constants";

function selectContainer(stage, containerId) {
  if (containerId === TYPE.TAG_BLOCK_CONTAINER) {
    return stage.tagBlockContainer;
  }

  return findBlockTreeById(stage.boilerplate, containerId);
}

function selectStageByParams(state, { index, id }) {
  const { challenges, isListLoading, isChallengeLoading } = state.challenge;
  const requestedChallenge = challenges[index];

  if (isListLoading && index !== 0) {
    return { isListLoading: true };
  }

  if (isChallengeLoading) {
    return { isChallengeLoading: true };
  }

  if (!requestedChallenge) {
    return { isValid: false };
  }

  if (!requestedChallenge.isLoaded) {
    return { isValid: true, isLoaded: false, challengeId: requestedChallenge._id };
  }

  if (!id) {
    return {
      isValid: true,
      isLoaded: true,
      hasChanged: true,
      challengeId: requestedChallenge._id,
      ...requestedChallenge.elementTree,
    };
  }

  const { stageId } = requestedChallenge;
  const stage = findBlockTreeById(requestedChallenge.elementTree, id);

  if (!stage) {
    return {
      isValid: false,
      challengeId: requestedChallenge._id,
    };
  }

  if (stageId !== stage._id) {
    return {
      isValid: true,
      isLoaded: true,
      challengeId: requestedChallenge._id,
      hasChanged: true,
      ...stage,
    };
  }

  return {
    isValid: true,
    isLoaded: true,
    challengeId: requestedChallenge._id,
    ...stage,
  };
}

export {
  selectContainer,
  selectStageByParams,
};
