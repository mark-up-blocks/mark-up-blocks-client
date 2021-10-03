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

      return {
        title,
        tagBlocks: tagBlocks.map((child) => ({ ...child, childTrees: [], hasUsed: false })),
        boilerplate,
        answer,
      };
    },
    addChildTree(state, { payload }) {
      const { containerId, itemId } = payload;
      const prevContainer = findBlockTree(
        state.boilerplate, (block) => findTagBlockById(block.childTrees, itemId),
      );

      if (prevContainer) {
        const tagBlock = findBlockTreeById(state.boilerplate, itemId);
        const container = findBlockTreeById(state.boilerplate, containerId);

        prevContainer.childTrees = prevContainer.childTrees.filter(
          (child) => child._id !== itemId,
        );
        container.childTrees.push(tagBlock);
      } else {
        const container = findBlockTreeById(state.boilerplate, containerId);
        const tagBlock = findTagBlockById(state.tagBlocks, itemId);

        container.childTrees.push({ ...tagBlock, _id: itemId });
        tagBlock.hasUsed = true;
      }
    },
  },
});

export const { setChallenge, addChildTree } = challengeSlice.actions;
export default challengeSlice.reducer;
