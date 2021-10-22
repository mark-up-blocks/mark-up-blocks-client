import { createSlice } from "@reduxjs/toolkit";
import { fetchChallengeList, fetchChallenge } from "./challengeThunks";
import { generateBlocks } from "../helpers/tagBlockGenerators";
import { findBlockTreeById, compareChildTreeByBlockIds, validatePosition } from "../helpers/blockTreeHandlers";
import { selectContainer } from "../helpers/globalSelectors";
import tutorialData from "../components/Tutorial/tutorialData";
import { TYPE } from "../constants";

const challengeSlice = createSlice({
  name: "challenge",
  initialState: {
    isListLoading: true,
    isChallengeLoading: false,
    selectedIndex: 0,
    challenges: [tutorialData],
  },
  reducers: {
    addChildTree(state, { payload }) {
      const {
        challengeIndex, prevContainerId, containerId, itemId, containerIndex, stageId,
      } = payload;
      const challenge = state.challenges[challengeIndex];
      const stage = findBlockTreeById(challenge.elementTree, stageId);

      const prevContainer = selectContainer(stage, prevContainerId);
      const container = selectContainer(stage, containerId);
      const blockTree = findBlockTreeById(prevContainer, itemId);
      let itemIndex = containerIndex === -1 ? container.childTrees.length : containerIndex;

      if (!blockTree) {
        return;
      }

      const isInvalidContainer = !!findBlockTreeById(blockTree, container._id);

      if (isInvalidContainer) {
        return;
      }

      if (prevContainer === container) {
        const prevIndex = prevContainer.childTrees.findIndex((child) => child === blockTree);

        if ((prevIndex === itemIndex) || (prevIndex + 1 === itemIndex)) {
          return;
        }

        if (itemIndex > prevIndex) {
          itemIndex -= 1;
        }
      }

      blockTree.isCorrect = containerId === TYPE.TAG_BLOCK_CONTAINER
        ? false
        : validatePosition({
          elementTree: challenge.elementTree, container, index: containerIndex, itemId,
        });

      prevContainer.childTrees = prevContainer.childTrees.filter((child) => child._id !== itemId);
      container.childTrees = [
        ...container.childTrees.slice(0, itemIndex),
        blockTree,
        ...container.childTrees.slice(itemIndex),
      ];
      stage.isCompleted = compareChildTreeByBlockIds(
        stage, stage.boilerplate,
      );
    },
    resetStage(state, { payload }) {
      const stageId = payload;
      const challenge = state.challenges[state.selectedIndex];
      const stage = findBlockTreeById(challenge.elementTree, stageId);

      stage.boilerplate = { ...stage, childTrees: [] };
      stage.tagBlockContainer = {
        _id: TYPE.TAG_BLOCK_CONTAINER,
        childTrees: generateBlocks(stage),
      };
    },
    initializeStage(state, { payload }) {
      const stageId = payload;
      const challenge = state.challenges[state.selectedIndex];
      const stage = findBlockTreeById(challenge.elementTree, stageId);

      if (!stage) {
        return;
      }

      if (stage.hasPreviousData) {
        return;
      }

      stage.elementTree = { ...stage, childTrees: stage.childTrees };
      stage.boilerplate = { ...stage, childTrees: [] };
      stage.tagBlockContainer = {
        _id: TYPE.TAG_BLOCK_CONTAINER,
        childTrees: generateBlocks(stage),
      };
      stage.hasPreviousData = true;
    },
    changeStage(state, { payload }) {
      const stageId = payload;
      const challenge = state.challenges[state.selectedIndex];
      const stage = findBlockTreeById(challenge.elementTree, stageId);

      if (!stage) {
        return;
      }

      challenge.stageId = stageId;
    },
  },
  extraReducers: {
    [fetchChallenge.fulfilled]: (state, { payload }) => {
      const { id, elementTree } = payload;
      const index = state.challenges.findIndex(({ _id }) => _id === id);
      const challenge = state.challenges[index];

      Object.assign(state, { selectedIndex: index, isChallengeLoading: false });
      challenge.elementTree = elementTree;
      challenge.stageId = challenge.elementTree._id;
      challenge.isLoaded = true;
    },
    [fetchChallenge.pending]: (state) => {
      Object.assign(state, { isChallengeLoading: true });
    },
    [fetchChallenge.rejected]: (state) => {
      Object.assign(state, { isChallengeLoading: false });
    },
    [fetchChallengeList.fulfilled]: (state, { payload }) => {
      const challenges = payload;

      Object.assign(state, {
        isListLoading: false,
        challenges: state.challenges.concat(challenges),
      });
    },
    [fetchChallengeList.pending]: (state) => {
      Object.assign(state, { isListLoading: true });
    },
    [fetchChallengeList.rejected]: (state) => {
      Object.assign(state, { isListLoading: false });
    },
  },
});

export const {
  addChildTree, resetStage, initializeStage, changeStage,
} = challengeSlice.actions;
export { fetchChallengeList, fetchChallenge };
export default challengeSlice.reducer;
