import { findBlockTreeById } from "./blockTreeHandlers";
import { TYPE } from "../constants";

function selectSelectedSubChallenge(state) {
  const challenge = state.challenges[state.selectedIndex];
  const challengeId = challenge.selectedSubChallengeId;
  const selectedSubChallenge = findBlockTreeById(challenge.elementTree, challengeId);

  return selectedSubChallenge;
}

function selectContainer(selectedSubChallenge, containerId) {
  if (containerId === TYPE.TAG_BLOCK_CONTAINER) {
    return selectedSubChallenge.tagBlockContainer;
  }

  return findBlockTreeById(selectedSubChallenge.boilerplate, containerId);
}

function selectChallenge(state) {
  const { isLoading, selectedIndex, challenges } = state.challenge;

  if (isLoading) {
    return { _id: "", name: "", elementTree: "" };
  }

  return challenges[selectedIndex];
}

function selectActiveChallenge(state) {
  const { selectedIndex, challenges } = state.challenge;
  const challenge = challenges[selectedIndex];
  const result = {
    _id: null,
    boilerplate: null,
    tagBlockContainer: null,
    elementTree: null,
    isCompleted: false,
  };

  if (!challenge) {
    return result;
  }

  const challengeId = challenge.selectedSubChallengeId;
  const selectedSubChallenge = findBlockTreeById(challenge.elementTree, challengeId);

  if (!selectedSubChallenge) {
    return result;
  }

  return {
    ...selectedSubChallenge,
    elementTree: selectedSubChallenge,
    isCompleted: Boolean(selectedSubChallenge.isCompleted),
  };
}

export {
  selectSelectedSubChallenge,
  selectContainer,
  selectChallenge,
  selectActiveChallenge,
};
