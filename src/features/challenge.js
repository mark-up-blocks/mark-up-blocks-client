import { createSlice } from "@reduxjs/toolkit";

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
        tagBlocks,
        boilerplate,
        answer,
      };
    },
  },
});

export const { setChallenge } = challengeSlice.actions;
export default challengeSlice.reducer;
