import { createSlice } from "@reduxjs/toolkit";
import { fetchChallenges, updateChallenge } from "./challengeThunks";
import { generateBlocks } from "../helpers/tagBlockGenerators";
import { findBlockTreeById } from "../helpers/blockTreeHandlers";
import { selectSelectedSubChallenge, selectContainer } from "../helpers/globalSelectors";
import tutorialData from "../components/Tutorial/tutorialData";
import { TYPE } from "../constants";

const challengeSlice = createSlice({
  name: "challenge",
  initialState: {
    isLoading: true,
    selectedIndex: 0,
    challenges: [tutorialData],
  },
  reducers: {
    markStageCompleted(state) {
      const selectedSubChallenge = selectSelectedSubChallenge(state);

      selectedSubChallenge.isCompleted = true;
    },
    addChildTree(state, { payload }) {
      const {
        prevContainerId, containerId, itemId, index,
      } = payload;
      const selectedSubChallenge = selectSelectedSubChallenge(state);

      const prevContainer = selectContainer(selectedSubChallenge, prevContainerId);
      const container = selectContainer(selectedSubChallenge, containerId);
      const blockTree = findBlockTreeById(prevContainer, itemId);

      const isInvalidContainer = Boolean(findBlockTreeById(blockTree, container._id));
      const isSameContainer = prevContainer._id === container._id;

      if (isInvalidContainer) {
        return;
      }

      container.childTrees = [
        ...container.childTrees.slice(0, index),
        blockTree,
        ...container.childTrees.slice(index),
      ];

      prevContainer.childTrees = prevContainer.childTrees.filter(
        (child, childIndex) => child._id !== itemId || (isSameContainer && childIndex === index),
      );
    },
  },
  extraReducers: {
    [updateChallenge.fulfilled]: (state, { payload }) => {
      const { subId, challengeIndex } = payload;
      const challenge = state.challenges[challengeIndex];
      const elementTree = payload.hasFetched ? payload.elementTree : challenge.elementTree;
      const selectedSubChallengeId = subId ?? elementTree._id;

      Object.assign(state, { selectedIndex: challengeIndex });
      challenge.selectedSubChallengeId = selectedSubChallengeId;

      const selectedSubChallenge = findBlockTreeById(elementTree, selectedSubChallengeId);

      if (selectedSubChallenge.boilerplate) {
        return;
      }

      selectedSubChallenge.boilerplate = { ...selectedSubChallenge, childTrees: [] };
      selectedSubChallenge.tagBlockContainer = {
        _id: TYPE.TAG_BLOCK_CONTAINER,
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

export const { markStageCompleted, addChildTree } = challengeSlice.actions;
export { fetchChallenges, updateChallenge };
export default challengeSlice.reducer;
