import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  findBlockTreeById, findContainerByChildId, findChallengeById,
} from "../utils/selectData";
import { getChallenge } from "../api";

const setChallenge = createAsyncThunk(
  "challenge/setChallenge",
  async ({ id, notifyError }, { getState }) => {
    const state = getState();
    const targetChallenge = findChallengeById(state?.challenge?.stageInfo?.rootChallenge.data, id);

    if (targetChallenge?.data) {
      return { _id: id, ...targetChallenge.data };
    }

    try {
      const challenge = await getChallenge(id);

      return challenge;
    } catch (err) {
      notifyError(err);

      return Promise.reject();
    }
  },
);

export const challengeSlice = createSlice({
  name: "challenge",
  initialState: {
    challengeId: "",
    title: "",
    tagBlockContainer: null,
    boilerplate: null,
    answer: null,
    isCompleted: false,
    stageInfo: {
      rootChallenge: {
        name: "",
        _id: "",
        data: null,
      },
    },
  },
  reducers: {
    setStageInfo(state, { payload }) {
      const { name, stage } = payload;

      Object.assign(state, {
        challengeId: null,
        stageInfo: {
          rootChallenge: {
            name,
            _id: stage._id,
            data: stage,
          },
        },
      });
    },
    markStageCompleted(state) {
      Object.assign(state, { isCompleted: true });
    },
    addChildTree(state, { payload }) {
      const { containerId, itemId, index } = payload;
      const prevContainer = findContainerByChildId(state.boilerplate, itemId)
        || findContainerByChildId(state.tagBlockContainer, itemId);
      const blockTree = findBlockTreeById(prevContainer, itemId);
      const container = containerId === "tagBlockContainer" ? state.tagBlockContainer : findBlockTreeById(state.boilerplate, containerId);
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
    [setChallenge.fulfilled]: (state, { payload }) => {
      const {
        _id, title, tagBlocks, boilerplate, answer, isCompleted,
      } = payload;
      const previousChallenge = findChallengeById(
        state.stageInfo.rootChallenge.data, state.challengeId,
      );

      if (previousChallenge) {
        Object.assign(previousChallenge, {
          data: {
            tagBlockContainer: state.tagBlockContainer,
            boilerplate: state.boilerplate,
            answer: state.answer,
            isLoaded: true,
            isCompleted: state.isCompleted,
          },
        });
      }

      const formattedTagBlocks = tagBlocks.map((child) => ({
        ...child,
        childTrees: child.isChallenge
          ? findBlockTreeById(answer, child.block._id).childTrees
          : [],
      }));

      const tagBlockContainer = {
        _id: "tagBlockContainer",
        tagName: "div",
        childTrees: formattedTagBlocks,
      };

      Object.assign(state, {
        challengeId: _id,
        title,
        tagBlockContainer,
        boilerplate,
        answer,
        isLoaded: true,
        isCompleted,
      });
    },
    [setChallenge.rejected]: (state) => {
      Object.assign(state, {
        challengeId: "",
      });
    },
  },
});

export const { setStageInfo, markStageCompleted, addChildTree } = challengeSlice.actions;
export { setChallenge };
export default challengeSlice.reducer;
