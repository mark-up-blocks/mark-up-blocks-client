import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getChallenge, getChallengeList } from "../api";
import { generateBlocks } from "../utils/generateBlocks";
import {
  findSubChallengeById, findBlockTreeById, findContainerByChildId,
} from "../utils/selectData";
import tutorialData from "../components/Tutorial/tutorialData";

const fetchChallenges = createAsyncThunk(
  "challenge/fetchChallenges",
  async ({ notifyError }) => {
    try {
      const { challenges } = await getChallengeList();

      return challenges;
    } catch (err) {
      notifyError(err);

      return Promise.reject();
    }
  },
);

const updateChallenge = createAsyncThunk(
  "challenge/updateChallenge",
  async ({ subId, index, notifyError }, { getState }) => {
    const state = getState();
    const numberIndex = Number.isNaN(Number(index)) ? null : Number(index);
    const challengeIndex = numberIndex ?? state.challenge.selectedIndex;
    let challenge = state.challenge.challenges[challengeIndex];

    if (!challenge) {
      notifyError("invalid index");

      return Promise.reject();
    }

    if (typeof challenge.elementTree === "object") {
      return {
        challengeIndex,
        subId,
        hasFetched: false,
      };
    }

    try {
      challenge = await getChallenge(challenge._id);

      return {
        challengeIndex,
        hasFetched: true,
        elementTree: challenge.elementTree,
      };
    } catch (err) {
      notifyError(err);

      return Promise.reject();
    }
  },
);

const challengeSlice = createSlice({
  name: "challenge",
  initialState: {
    isLoading: true,
    selectedIndex: 0,
    challenges: [tutorialData],
  },
  reducers: {
    markStageCompleted(state) {
      const challenge = state.challenges[state.selectedIndex];
      const challengeId = challenge.selectedSubChallengeId;
      const selectedSubChallenge = findSubChallengeById(challenge.elementTree, challengeId);

      selectedSubChallenge.isCompleted = true;
    },
    addChildTree(state, { payload }) {
      const { containerId, itemId, index } = payload;
      const challenge = state.challenges[state.selectedIndex];
      const challengeId = challenge.selectedSubChallengeId;
      const selectedSubChallenge = findSubChallengeById(challenge.elementTree, challengeId);

      const prevContainer = findContainerByChildId(selectedSubChallenge.tagBlockContainer, itemId)
        || findContainerByChildId(selectedSubChallenge.boilerplate, itemId);
      const blockTree = findBlockTreeById(prevContainer, itemId);
      const container = containerId === "tagBlockContainer" ? selectedSubChallenge.tagBlockContainer : findBlockTreeById(selectedSubChallenge.boilerplate, containerId);
      const isSameContainer = prevContainer._id === container._id;
      const isInvalidContainer = findBlockTreeById(blockTree, container._id);

      if (isSameContainer || isInvalidContainer) {
        return;
      }

      container.childTrees = [
        ...container.childTrees.slice(0, index),
        blockTree,
        ...container.childTrees.slice(index),
      ];

      prevContainer.childTrees = prevContainer.childTrees.filter(
        (child, childIndex) => {
          const isDifferentBlock = child._id !== itemId;
          const isCurrentBlock = prevContainer === container
              && child._id === itemId && childIndex === index;

          return isDifferentBlock || isCurrentBlock;
        },
      );
    },
  },
  extraReducers: {
    [updateChallenge.fulfilled]: (state, { payload }) => {
      const { subId, challengeIndex } = payload;
      const challenge = state.challenges[challengeIndex];
      const elementTree = payload.hasFetched ? payload.elementTree : challenge.elementTree;
      const selectedSubChallengeId = subId ?? elementTree._id;

      challenge.selectedSubChallengeId = selectedSubChallengeId;
      Object.assign(state, { selectedIndex: challengeIndex });

      const selectedSubChallenge = findSubChallengeById(elementTree, selectedSubChallengeId);

      if (selectedSubChallenge.boilerplate) {
        return;
      }

      selectedSubChallenge.boilerplate = { ...selectedSubChallenge, childTrees: [] };
      selectedSubChallenge.tagBlockContainer = {
        _id: "tagBlockContainer",
        childTrees: generateBlocks(selectedSubChallenge, true),
      };

      if (payload.hasFetched) {
        challenge.elementTree = elementTree;
      }
    },
    [fetchChallenges.fulfilled]: (state, { payload }) => {
      const challenges = payload;

      Object.assign(state, {
        isLoading: false,
        challenges: state.challenges.concat(challenges),
      });
    },
    [fetchChallenges.pending]: (state) => {
      Object.assign(state, { isLoading: true });
    },
    [fetchChallenges.rejected]: (state) => {
      Object.assign(state, { isLoading: false });
    },
  },
});

function selectChallenge(state) {
  const { selectedIndex, challenges } = state.challenge;
  const challenge = challenges[selectedIndex];

  if (!challenge) {
    return {
      _id: null,
      boilerplate: null,
      tagBlockContainer: null,
      elementTree: null,
      isCompleted: false,
    };
  }

  const challengeId = challenge.selectedSubChallengeId;
  const selectedSubChallenge = findSubChallengeById(challenge.elementTree, challengeId);

  if (!selectedSubChallenge) {
    return {
      _id: null,
      boilerplate: null,
      tagBlockContainer: null,
      elementTree: null,
      isCompleted: false,
    };
  }

  return {
    ...selectedSubChallenge,
    elementTree: selectedSubChallenge,
    isCompleted: Boolean(selectedSubChallenge.isCompleted),
  };
}

export const { markStageCompleted, addChildTree } = challengeSlice.actions;
export { fetchChallenges, updateChallenge };
export { selectChallenge };
export default challengeSlice.reducer;
