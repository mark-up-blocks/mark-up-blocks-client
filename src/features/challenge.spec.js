import reducer, {
  fetchChallengeList, fetchChallenge,
  initializeStage, changeStage,
} from "./challenge";
import tutorialData from "../components/Tutorial/tutorialData";
import { mockChallengeList, flatChallenge, nestedChallenge } from "../../__mocks__/mockData";

const initialState = {
  isListLoading: true,
  isChallengeLoading: false,
  selectedIndex: 0,
  challenges: [tutorialData],
};

describe("challenge reducer test", () => {
  describe("initial state", () => {
    test("should return the initial state", () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });
  });

  describe("fetchChallengeList", () => {
    test("should handle fulfilled state", () => {
      const updatedState = reducer(initialState, fetchChallengeList.fulfilled(mockChallengeList));

      expect(updatedState).toMatchObject({
        isListLoading: false,
        challenges: [tutorialData, ...mockChallengeList],
      });
    });

    test("should handle pending state", () => {
      const updatedState = reducer(
        { ...initialState, isListLoading: false },
        fetchChallengeList.pending(),
      );

      expect(updatedState.isListLoading).toEqual(true);
    });

    test("should handle reject state", () => {
      const updatedState = reducer(
        { ...initialState, isListLoading: true },
        fetchChallengeList.rejected(),
      );

      expect(updatedState.isListLoading).toEqual(false);
    });
  });

  describe("fetchChallenge", () => {
    test("should handle fulfilled state", () => {
      const payload = {
        id: flatChallenge._id,
        elementTree: flatChallenge.elementTree,
      };
      const prevState = {
        isListLoading: false,
        isChallengeLoading: true,
        selectedIndex: 0,
        challenges: [tutorialData, ...mockChallengeList],
      };

      const updatedState = reducer(prevState, fetchChallenge.fulfilled(payload));

      expect(updatedState.isChallengeLoading).toEqual(false);
      expect(updatedState.challenges[1].isLoaded).toEqual(true);

      const challenge = updatedState.challenges[1];

      expect(challenge.isLoaded).toBeTruthy();
      expect(challenge.elementTree).toMatchObject(flatChallenge.elementTree);
    });

    test("should handle pending state", () => {
      const updatedState = reducer(
        { ...initialState, isChallengeLoading: false },
        fetchChallenge.pending(undefined, { id: tutorialData._id }),
      );

      expect(updatedState.isChallengeLoading).toEqual(true);
    });

    test("should handle reject state", () => {
      const updatedState = reducer(
        { ...initialState, isChallengeLoading: true },
        fetchChallenge.rejected(undefined, null, { id: tutorialData._id }),
      );

      expect(updatedState.isChallengeLoading).toEqual(false);
      expect(updatedState.challenges[0].hasError).toEqual(true);
      expect(updatedState.challenges[0].isLoaded).toEqual(false);
    });
  });

  describe("initializeStage", () => {
    test("should initialize stage", () => {
      const prevState = {
        selectedIndex: 1,
        challenges: [tutorialData, flatChallenge],
      };
      const updatedState = reducer(prevState, initializeStage("elementTree0"));
      const challenge = updatedState.challenges[1];

      expect(challenge.elementTree).toMatchObject({
        boilerplate: {
          block: challenge.elementTree.block,
          childTrees: [],
        },
        tagBlockContainer: {
          _id: "tagBlockContainer",
          childTrees: flatChallenge.elementTree.childTrees,
        },
        hasPreviousData: true,
      });
    });

    test("should early return when stage data not exist", () => {
      const payload = "invalid stage id";
      const updatedState = reducer(initialState, initializeStage(payload));

      expect(updatedState).toEqual(initialState);
    });

    test("should early return when stage data already exist", () => {
      const prevState = {
        selectedIndex: 0,
        challenges: [
          {
            ...flatChallenge,
            elementTree: {
              ...flatChallenge.elementTree,
              hasPreviousData: true,
            },
          },
        ],
      };

      const updatedState = reducer(prevState, initializeStage("elementTree0"));

      expect(updatedState).toEqual(prevState);
    });
  });

  describe("changeStage", () => {
    test("should change stage", () => {
      const prevState = {
        selectedIndex: 1,
        challenges: [
          tutorialData,
          {
            ...nestedChallenge,
            stageId: "elementTree1",
          },
        ],
      };

      const updatedState = reducer(prevState, changeStage({ index: 1, stageId: "elementTree1Child" }));
      const challenge = updatedState.challenges[1];

      expect(challenge.stageId).toBe("elementTree1Child");
    });

    test("should not change stage when stage id is invalid", () => {
      const prevState = {
        selectedIndex: 1,
        challenges: [
          tutorialData,
          {
            ...nestedChallenge,
            stageId: "elementTree1",
          },
        ],
      };

      const updatedState = reducer(prevState, changeStage({ index: 1, stageId: "invalidStageId" }));

      expect(updatedState).toMatchObject(prevState);
    });
  });
});
