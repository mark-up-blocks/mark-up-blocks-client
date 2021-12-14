import { findBlockTreeById } from "./blockTreeHandlers";
import { TYPE } from "../constants";

function selectContainer(stage, containerId) {
  if (containerId === TYPE.TAG_BLOCK_CONTAINER) {
    return stage.tagBlockContainer;
  }

  return findBlockTreeById(stage.boilerplate, containerId);
}

function selectStage(state) {
  const { challenges, selectedIndex } = state.challenge;
  const challenge = challenges[selectedIndex];
  const stage = findBlockTreeById(challenge.elementTree, challenge.stageId);

  return stage;
}

function selectBlockTreeById(state, containerId, id) {
  const { challenges, selectedIndex } = state.challenge;
  const challenge = challenges[selectedIndex];
  const stage = findBlockTreeById(challenge.elementTree, challenge.stageId);
  const container = containerId ? selectContainer(stage, containerId) : stage.boilerplate;

  return findBlockTreeById(container, id);
}

function selectStageByParams(state, { index, id }) {
  const {
    challenges, isListLoading, isChallengeLoading, selectedIndex,
  } = state.challenge;
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

  if (requestedChallenge.hasError) {
    return {
      isValid: true,
      hasError: true,
    };
  }

  if (index !== selectedIndex && !requestedChallenge.isLoaded) {
    return {
      isValid: true,
      isLoaded: false,
      hasChanged: true,
      challengeId: requestedChallenge._id,
    };
  }

  if (!id) {
    return {
      isValid: true,
      isLoaded: true,
      hasChanged: index !== selectedIndex,
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
  selectStage,
  selectStageByParams,
  selectBlockTreeById,
};
