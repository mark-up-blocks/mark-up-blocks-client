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
        prevContainerId, containerId, itemId, index, stageId,
      } = payload;
      const challenge = state.challenges[state.selectedIndex];
      const stage = findBlockTreeById(challenge.elementTree, stageId);

      const prevContainer = selectContainer(stage, prevContainerId);
      const container = selectContainer(stage, containerId);
      const blockTree = findBlockTreeById(prevContainer, itemId);
      const itemIndex = index === -1 ? container.childTrees.length : index;

      const isInvalidContainer = !!findBlockTreeById(blockTree, container._id);
      const childTrees = [];

      if (isInvalidContainer) {
        return;
      }

      blockTree.isCorrect = containerId === TYPE.TAG_BLOCK_CONTAINER
        ? false
        : validatePosition({
          elementTree: challenge.elementTree, container, index, itemId,
        });

      if (container._id === TYPE.TAG_BLOCK_CONTAINER && blockTree.childTrees.length) {
        const tagBlocks = generateBlocks(blockTree, false);
        const challengeTagBlocks = generateBlocks(stage);

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
      challenge.elementTree = {
        ...elementTree,
        boilerplate: { ...elementTree, childTrees: [] },
        tagBlockContainer: {
          _id: TYPE.TAG_BLOCK_CONTAINER,
          childTrees: generateBlocks(elementTree),
        },
      };
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
