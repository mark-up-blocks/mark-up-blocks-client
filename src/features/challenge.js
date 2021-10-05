import { createSlice } from "@reduxjs/toolkit";
import { findBlockTreeById, findBlockTree, findTagBlockById } from "../utils/selectData";

export const challengeSlice = createSlice({
  name: "challenge",
  initialState: {
    title: "",
    tagBlocks: [],
    boilerplate: null,
    answer: null,
  },
  reducers: {
    setChallenge(state, { payload }) {
      const {
        title, tagBlocks, boilerplate, answer,
      } = payload;

      const formattedTagBlocks = tagBlocks.map(
        (child) => {
          if (child.isElementCluster) {
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

      return {
        title,
        tagBlocks: formattedTagBlocks,
        boilerplate,
        answer,
      };
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

export const { setChallenge, addChildTree } = challengeSlice.actions;
export default challengeSlice.reducer;
