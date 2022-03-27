import { createSlice } from "@reduxjs/toolkit";
import { fetchChallengeList, fetchChallenge } from "./challengeThunks";
import { generateBlocks } from "../helpers/tagBlockGenerators";
import {
  mapSubChallenge,
  findBlockTreeById,
  compareChildTreeByBlockIds,
  validatePosition,
  findNextUncompletedChallenge,
} from "../helpers/blockTreeHandlers";
import { selectContainer } from "../helpers/globalSelectors";
import tutorialData from "../components/Tutorial/tutorialData";
import { TYPE } from "../constants";

function initialize(stage) {
  const boilerplate = { ...stage, childTrees: [] };
  const tagBlockContainer = {
    _id: TYPE.TAG_BLOCK_CONTAINER,
    childTrees: generateBlocks(stage),
  };

  return {
    ...stage, boilerplate, tagBlockContainer, isCompleted: false,
  };
}

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

      if (stage.isCompleted) {
        const nextStage = findNextUncompletedChallenge(challenge.elementTree, stageId);

        if (!nextStage) {
          challenge.isCompleted = true;
        }
      }
    },
    resetStage(state, { payload }) {
      const stageId = payload;
      const challenge = state.challenges[state.selectedIndex];
      const stage = findBlockTreeById(challenge.elementTree, stageId);
      const { boilerplate, tagBlockContainer } = initialize(stage);

      stage.boilerplate = boilerplate;
      stage.tagBlockContainer = tagBlockContainer;
    },
    markStageAnswer(state, { payload: stageId }) {
      const challenge = state.challenges[state.selectedIndex];
      const stage = findBlockTreeById(challenge.elementTree, stageId);

      stage.boilerplate.childTrees = mapSubChallenge(
        stage.elementTree, (copied) => ({ ...copied }),
      ).childTrees;
      stage.tagBlockContainer = { ...stage.tagBlockContainer, childTrees: [] };
      stage.isCompleted = true;
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

      const { boilerplate, tagBlockContainer } = initialize(stage);
      stage.elementTree = { ...stage, childTrees: stage.childTrees };
      stage.boilerplate = boilerplate;
      stage.tagBlockContainer = tagBlockContainer;
      stage.hasPreviousData = true;
    },
    changeStage(state, { payload }) {
      const { stageId, index } = payload;

      if (Number.isNaN(Number(index))) {
        return;
      }

      const challenge = state.challenges[index];

      if (!challenge) {
        return;
      }

      const stage = findBlockTreeById(challenge.elementTree, stageId);

      challenge.stageId = stage ? stageId : challenge.elementTree?._id;
      Object.assign(state, { selectedIndex: index });
    },
    resetChallenges(state) {
      const { challenges } = state;

      return {
        ...state,
        selectedIndex: 0,
        challenges: challenges.map(
          (challenge) => ({
            ...challenge,
            elementTree: mapSubChallenge(challenge.elementTree, initialize),
            stageId: challenge.elementTree._id,
          }),
        ),
      };
    },
  },
  extraReducers: {
    [fetchChallenge.fulfilled]: (state, { payload }) => {
      const { id, elementTree } = payload;
      const index = state.challenges.findIndex(({ _id }) => _id === id);
      const challenge = state.challenges[index];

      Object.assign(state, { isChallengeLoading: false });
      challenge.elementTree = elementTree;
      challenge.stageId = challenge.elementTree._id;
      challenge.isLoaded = true;
    },
    [fetchChallenge.pending]: (state, { meta }) => {
      const { id } = meta.arg;

      if (id === state.challenges[state.selectedIndex]._id) {
        Object.assign(state, { isChallengeLoading: true });
      }
    },
    [fetchChallenge.rejected]: (state, { meta }) => {
      const { id } = meta.arg;
      const index = state.challenges.findIndex(({ _id }) => _id === id);
      const challenge = state.challenges[index];

      Object.assign(state, { isChallengeLoading: false });
      challenge.isLoaded = false;
      challenge.hasError = true;
    },
    [fetchChallengeList.fulfilled]: (state, { payload: challenges }) => {
      Object.assign(state, {
        isListLoading: false,
        challenges: [state.challenges[0], ...challenges],
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
  addChildTree, resetStage, initializeStage, changeStage, resetChallenges, markStageAnswer,
} = challengeSlice.actions;
export { fetchChallengeList, fetchChallenge };
export default challengeSlice.reducer;
