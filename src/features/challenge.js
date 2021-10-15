import { createSlice } from "@reduxjs/toolkit";
import { fetchChallenges, updateChallenge } from "./challengeThunks";
import { generateBlocks } from "../helpers/tagBlockGenerators";
import { findBlockTreeById, compareChildTreeByBlockIds } from "../helpers/blockTreeHandlers";
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
    addChildTree(state, { payload }) {
      const {
        prevContainerId, containerId, itemId, index,
      } = payload;
      const selectedSubChallenge = selectSelectedSubChallenge(state);

      const prevContainer = selectContainer(selectedSubChallenge, prevContainerId);
      const container = selectContainer(selectedSubChallenge, containerId);
      const blockTree = findBlockTreeById(prevContainer, itemId);
      const itemIndex = index === -1 ? container.childTrees.length : index;

      const isInvalidContainer = !!findBlockTreeById(blockTree, container._id);
      const childTrees = [];

      if (isInvalidContainer) {
        return;
      }

      if (container._id === TYPE.TAG_BLOCK_CONTAINER && blockTree.childTrees.length) {
        const tagBlocks = generateBlocks(blockTree, false);
        const challengeTagBlocks = generateBlocks(selectedSubChallenge);

        childTrees.push({ ...blockTree, childTrees: [] });
        tagBlocks.forEach((child) => {
          if (challengeTagBlocks.find(({ _id }) => _id === child._id)) {
            childTrees.push({ ...child, childTrees: [] });
          }
        });
      } else {
        childTrees.push(blockTree);
      }

      prevContainer.childTrees = prevContainer.childTrees.filter((child) => child._id !== itemId);
      container.childTrees = [
        ...container.childTrees.slice(0, itemIndex),
        ...childTrees,
        ...container.childTrees.slice(itemIndex),
      ];
      selectedSubChallenge.isCompleted = compareChildTreeByBlockIds(
        selectedSubChallenge, selectedSubChallenge.boilerplate,
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
        childTrees: generateBlocks(selectedSubChallenge),
      };
      selectedSubChallenge.isLoaded = true;

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

export const { addChildTree } = challengeSlice.actions;
export { fetchChallenges, updateChallenge };
export default challengeSlice.reducer;
