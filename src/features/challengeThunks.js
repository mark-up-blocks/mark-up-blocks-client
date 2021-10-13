import { createAsyncThunk } from "@reduxjs/toolkit";
import { getChallenge, getChallengeList } from "../api";

const fetchChallenges = createAsyncThunk(
  "challenge/fetchChallenges",
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

const updateChallenge = createAsyncThunk(
  "challenge/updateChallenge",
  async ({ subId, index, notifyError }, { getState }) => {
    const state = getState();
    const numberIndex = Number.isNaN(Number(index)) ? null : Number(index);
    const challengeIndex = numberIndex ?? state.challenge.selectedIndex;
    const challenge = state.challenge.challenges[challengeIndex];

    if (!challenge) {
      notifyError("invalid index");

      return Promise.reject();
    }

    if (typeof challenge.elementTree === "object") {
      return {
        challengeIndex,
        subId: subId || challenge.elementTree._id,
        hasFetched: false,
      };
    }

    try {
      const { elementTree } = await getChallenge(challenge._id);

      return {
        challengeIndex,
        hasFetched: true,
        subId: elementTree._id,
        elementTree,
      };
    } catch (err) {
      notifyError(err);

      return Promise.reject();
    }
  },
);

export { fetchChallenges, updateChallenge };
