import reducer, {
  clearStatus, setError, setLoading, setFinishPopup,
} from "./notice";
import { MESSAGE } from "../constants";

const initialState = {
  status: "",
  needPreventRender: false,
  message: "",
  stageId: "",
  preventClear: false,
};

describe("notice reducer test", () => {
  describe("initial state", () => {
    test("should return the initial state", () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });
  });

  describe("clearStatus", () => {
    const prevState = {
      status: "error",
      needPreventRender: true,
      message: "prev message",
      stageId: "mockStageId1",
      preventClear: false,
    };

    test("should reset state as initial state", () => {
      expect(reducer(prevState, clearStatus())).toEqual(initialState);
    });
  });

  describe("setError", () => {
    test("should handle setError", () => {
      const payload = {
        message: "new error",
        stageId: "mockStageId2",
      };

      expect(reducer(initialState, setError(payload))).toEqual({
        status: "error",
        needPreventRender: true,
        message: "new error",
        stageId: "mockStageId2",
        preventClear: false,
      });
    });

    test("should handle setError with default value", () => {
      expect(reducer(initialState, setError())).toEqual({
        status: "error",
        needPreventRender: true,
        message: MESSAGE.INTERNAL_SERVER_ERROR,
        stageId: "",
        preventClear: false,
      });
    });
  });

  describe("setLoading", () => {
    test("should handle setLoading", () => {
      const payload = {
        message: "new loading state",
        stageId: "mockStageId3",
      };

      expect(reducer(initialState, setLoading(payload))).toEqual({
        status: "loading",
        needPreventRender: true,
        message: "new loading state",
        stageId: "mockStageId3",
        preventClear: false,
      });
    });

    test("should handle setError with default value", () => {
      expect(reducer(initialState, setLoading())).toEqual({
        status: "loading",
        needPreventRender: true,
        message: MESSAGE.LOADING,
        stageId: "",
        preventClear: false,
      });
    });
  });

  describe("setFinishPopup", () => {
    test("should handle setFinishPopup", () => {
      const payload = {
        stageId: "mockStageId4",
        isFinalChallenge: false,
      };

      expect(reducer(initialState, setFinishPopup(payload))).toEqual({
        status: "finish",
        needPreventRender: false,
        message: "",
        stageId: "mockStageId4",
        preventClear: false,
      });
    });

    test("should handle setError with isFinalChallenge true", () => {
      const payload = {
        stageId: "mockStageId5",
        isFinalChallenge: true,
      };

      expect(reducer(initialState, setFinishPopup(payload))).toEqual({
        status: "allDone",
        needPreventRender: false,
        message: "",
        stageId: "mockStageId5",
        preventClear: false,
      });
    });
  });
});
