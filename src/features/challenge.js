import { createSlice } from "@reduxjs/toolkit";
import {
  findBlockTreeById, findBlockTree, findTagBlockById, findChallengeById,
} from "../utils/selectData";

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
      const { _id, name, stage } = payload;

      Object.assign(state, {
        challengeId: stage._id,
        stageInfo: {
          rootChallenge: {
            name,
            _id,
            data: stage,
          },
        },
      });
    },
    changeStage(state, { payload }) {
      const challengeId = payload;
      const previousChallenge = findChallengeById(
        state.stageInfo.rootChallenge.data, state.challengeId,
      );
      const selectedChallenge = findChallengeById(
        state.stageInfo.rootChallenge.data,
        challengeId,
      );

      previousChallenge.data = {
        tagBlocks: state.tagBlocks,
        boilerplate: state.boilerplate,
        answer: state.answer,
        isLoaded: true,
        isCompleted: state.isCompleted,
      };

      if (!selectedChallenge.data) {
        Object.assign(state, {
          challengeId,
          isLoaded: false,
        });
        return;
      }

      Object.assign(state, {
        ...selectedChallenge.data,
        challengeId: selectedChallenge._id,
        title: selectedChallenge.title,
      });
    },
    setChallenge(state, { payload }) {
      const {
        _id, title, tagBlocks, boilerplate, answer,
      } = payload;

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
      });
    },
    markStageCompleted(state) {
      if (!state.challengeId) {
        return;
      }

      if (state.isCompleted) {
        return;
      }

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
});

export const {
  setStageInfo, changeStage, setChallenge, markStageCompleted, addChildTree,
} = challengeSlice.actions;
export default challengeSlice.reducer;
