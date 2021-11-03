import { createAsyncThunk } from "@reduxjs/toolkit";
import { getChallenge, getChallengeList } from "../api";

const fetchChallengeList = createAsyncThunk(
  "challenge/fetchChallengeList",
  async ({ notifyError }) => {
    try {
      const { challenges } = await getChallengeList();

      return challenges;
    } catch (err) {
      notifyError(err);

      return Promise.reject();
    }
  },
);

const fetchChallenge = createAsyncThunk(
  "challenge/fetchChallenge",
  async ({ id, notifyError }) => {
    try {
      const { elementTree } = await getChallenge(id);

      return { id, elementTree };
    } catch (err) {
      notifyError(err);

      return Promise.reject();
    }
  },
);

export { fetchChallengeList, fetchChallenge };
