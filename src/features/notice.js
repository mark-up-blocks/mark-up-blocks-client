import { createSlice } from "@reduxjs/toolkit";

import { MESSAGE, TYPE } from "../constants";

const initialState = {
  status: "",
  needPreventRender: false,
  message: "",
  stageId: "",
  needPreventClear: false,
};

const noticeSlice = createSlice({
  name: "notice",
  initialState,
  reducers: {
    clearStatus(state) {
      Object.assign(state, initialState);
    },
    setError(state, { payload }) {
      const message = payload?.message || MESSAGE.INTERNAL_SERVER_ERROR;
      const stageId = payload?.stageId || "";
      const needPreventClear = payload?.needPreventClear || false;

      Object.assign(state, {
        status: TYPE.ERROR,
        needPreventRender: true,
        message,
        stageId,
        needPreventClear,
      });
    },
    setLoading(state, { payload }) {
      if (state.status === TYPE.ERROR) {
        return;
      }

      const message = payload?.message || MESSAGE.LOADING;
      const stageId = payload?.stageId || "";

      Object.assign(state, {
        status: TYPE.LOADING,
        needPreventRender: true,
        message,
        stageId,
      });
    },
    setFinishPopup(state, { payload }) {
      const { stageId, isFinalChallenge } = payload;
      const status = isFinalChallenge ? TYPE.ALL_DONE : TYPE.FINISH;

      Object.assign(state, {
        status,
        needPreventRender: false,
        message: "",
        stageId,
      });
    },
  },
});

export const {
  clearStatus, setError, setLoading, setFinishPopup,
} = noticeSlice.actions;
export default noticeSlice.reducer;
