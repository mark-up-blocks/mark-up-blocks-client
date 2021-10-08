import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  findBlockTreeById, findBlockTree, findTagBlockById, findChallengeById,
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
    tagBlocks: [],
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
      const prevContainer = findBlockTree(
        state.boilerplate, (block) => findTagBlockById(block.childTrees, itemId),
      );
      const tagBlock = findTagBlockById(state.tagBlocks, itemId);
      const blockTree = prevContainer
        ? findBlockTreeById(prevContainer, itemId)
        : { ...tagBlock, _id: itemId };
      const container = findBlockTreeById(state.boilerplate, containerId);

      if (findBlockTreeById(blockTree, container._id)) {
        return;
      }

      container.childTrees = [
        ...container.childTrees.slice(0, index),
        blockTree,
        ...container.childTrees.slice(index),
      ];

      if (prevContainer) {
        prevContainer.childTrees = prevContainer.childTrees.filter(
          (child, childIndex) => {
            const isDifferentBlock = child._id !== itemId;
            const isCurrentBlock = prevContainer === container
              && child._id === itemId && childIndex === index;

            return isDifferentBlock || isCurrentBlock;
          },
        );
      } else {
        tagBlock.hasUsed = true;
      }
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
            tagBlocks: state.tagBlocks,
            boilerplate: state.boilerplate,
            answer: state.answer,
            isLoaded: true,
            isCompleted: state.isCompleted,
          },
        });
      }

      const formattedTagBlocks = tagBlocks.map(
        (child) => {
          if (child.isChallenge) {
            return {
              ...child,
              childTrees: (findBlockTree(answer,
                (block) => block.block._id === child.block._id)).childTrees,
              hasUsed: false,
            };
          }

          return { ...child, childTrees: [], hasUsed: false };
        },
      );

      Object.assign(state, {
        challengeId: _id,
        title,
        tagBlocks: formattedTagBlocks,
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
