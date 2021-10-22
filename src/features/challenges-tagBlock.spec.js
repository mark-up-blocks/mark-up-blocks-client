import reducer, { addChildTree, resetStage, initializeStage } from "./challenge";
import tutorialData, { sampleBlock } from "../components/Tutorial/tutorialData";
import { flatChallenge, nestedChallenge, deeplyNestedChallenge } from "../helpers/test/mockData";

const initialState = {
  isListLoading: true,
  isChallengeLoading: false,
  selectedIndex: 0,
  challenges: [tutorialData],
};

describe("challenge reducer test (handling block logic)", () => {
  describe("addChildTree", () => {
    describe("tutorial", () => {
      const payload = {
        challengeIndex: 0,
        prevContainerId: "tagBlockContainer",
        containerId: "tutorialTree",
        itemId: "tutorial-in-order",
        stageId: "tutorialTree",
      };

      expect(initialState.challenges[initialState.selectedIndex]).toMatchObject({
        stageId: "tutorialTree",
        elementTree: {
          _id: "tutorialTree",
          childTrees: [sampleBlock],
        },
      });

      const initializedStage = reducer(initialState, initializeStage(payload.stageId));
      const updatedState = reducer(initializedStage, addChildTree(payload));

      test("should move item by payload", () => {
        expect(updatedState.challenges[payload.challengeIndex]).toMatchObject({
          stageId: "tutorialTree",
          elementTree: {
            _id: "tutorialTree",
            isCompleted: true,
            childTrees: [sampleBlock],
            boilerplate: {
              childTrees: [sampleBlock],
            },
            tagBlockContainer: {
              childTrees: [],
            },
          },
        });
      });
    });

    describe("flat challenge", () => {
      test("should move item by payload", () => {
        const childBlock = flatChallenge.elementTree.childTrees[0];
        const prevState = {
          isListLoading: false,
          isChallengeLoading: false,
          selectedIndex: 1,
          challenges: [
            tutorialData,
            {
              _id: "flatChallenge",
              name: "flat",
              isLoaded: true,
              stageId: "elementTree0",
              elementTree: {
                _id: "elementTree0",
                block: { _id: "elementTree0Block" },
                childTrees: [childBlock],
                boilerplate: {
                  _id: "elementTree0",
                  block: { _id: "elementTree0Block" },
                  childTrees: [],
                },
                tagBlockContainer: {
                  _id: "tagBlockContainer",
                  childTrees: [childBlock],
                },
              },
            },
          ],
        };

        const payload = {
          challengeIndex: 1,
          prevContainerId: "tagBlockContainer",
          containerId: "elementTree0",
          itemId: "elementTree0Child",
          stageId: "elementTree0",
        };

        const updatedState = reducer(prevState, addChildTree(payload));

        expect(updatedState.challenges[payload.challengeIndex]).toMatchObject({
          stageId: "elementTree0",
          elementTree: {
            _id: "elementTree0",
            isCompleted: true,
            childTrees: [childBlock],
            boilerplate: {
              childTrees: [childBlock],
            },
            tagBlockContainer: {
              childTrees: [],
            },
          },
        });
      });

      test("should handle item moved back to tagBlockContainer", () => {
        const childBlock = flatChallenge.elementTree.childTrees[0];
        const prevState = {
          isListLoading: false,
          isChallengeLoading: false,
          selectedIndex: 1,
          challenges: [
            tutorialData,
            {
              _id: "flatChallenge",
              name: "flat",
              isLoaded: true,
              stageId: "elementTree0",
              elementTree: {
                _id: "elementTree0",
                block: { _id: "elementTree0Block" },
                childTrees: [childBlock],
                boilerplate: {
                  _id: "elementTree0",
                  block: { _id: "elementTree0Block" },
                  childTrees: [childBlock],
                },
                tagBlockContainer: {
                  _id: "tagBlockContainer",
                  childTrees: [],
                },
              },
            },
          ],
        };
        const payload = {
          challengeIndex: 1,
          prevContainerId: "elementTree0",
          containerId: "tagBlockContainer",
          itemId: "elementTree0Child",
          stageId: "elementTree0",
        };

        const updatedState = reducer(prevState, addChildTree(payload));

        expect(updatedState.challenges[payload.challengeIndex]).toMatchObject({
          stageId: "elementTree0",
          elementTree: {
            _id: "elementTree0",
            isCompleted: false,
            childTrees: [childBlock],
            boilerplate: {
              childTrees: [],
            },
            tagBlockContainer: {
              childTrees: [childBlock],
            },
          },
        });
      });
    });

    describe("nested challenge", () => {
      test("should move item to specific index of container", () => {
        const [targetChild, otherChild] = nestedChallenge.elementTree.childTrees;
        const prevState = {
          isListLoading: false,
          isChallengeLoading: false,
          selectedIndex: 1,
          challenges: [
            tutorialData,
            {
              _id: "nestedChallenge",
              name: "nested",
              isLoaded: true,
              stageId: "elementTree1",
              elementTree: {
                _id: "elementTree1",
                block: { _id: "elementTree1Block" },
                childTrees: [targetChild, otherChild],
                boilerplate: {
                  _id: "elementTree1",
                  block: { _id: "elementTree1Block" },
                  childTrees: [otherChild],
                },
                tagBlockContainer: {
                  _id: "tagBlockContainer",
                  childTrees: [targetChild],
                },
              },
            },
          ],
        };
        const payload = {
          challengeIndex: 1,
          prevContainerId: "tagBlockContainer",
          containerId: "elementTree1",
          containerIndex: 0,
          itemId: "elementTree1Child",
          stageId: "elementTree1",
        };

        const updatedState = reducer(prevState, addChildTree(payload));

        expect(updatedState.challenges[payload.challengeIndex]).toMatchObject({
          stageId: "elementTree1",
          elementTree: {
            _id: "elementTree1",
            isCompleted: true,
            childTrees: [targetChild, otherChild],
            boilerplate: {
              childTrees: [targetChild, otherChild],
            },
            tagBlockContainer: {
              childTrees: [],
            },
          },
        });
      });

      test("should handle nested moving", () => {
        const [otherChild, containerChild] = deeplyNestedChallenge.elementTree.childTrees;
        const [targetGrandChild] = containerChild.childTrees;
        const prevState = {
          isListLoading: false,
          isChallengeLoading: false,
          selectedIndex: 1,
          challenges: [
            tutorialData,
            {
              _id: "nestedChallenge",
              name: "nested",
              isLoaded: true,
              stageId: "elementTree1",
              elementTree: {
                _id: "elementTree1",
                block: { _id: "elementTree1Block" },
                childTrees: [containerChild, otherChild],
                boilerplate: {
                  _id: "elementTree1",
                  block: { _id: "elementTree1Block" },
                  childTrees: [
                    {
                      ...containerChild,
                      childTrees: [],
                    },
                    otherChild,
                  ],
                },
                tagBlockContainer: {
                  _id: "tagBlockContainer",
                  childTrees: [targetGrandChild],
                },
              },
            },
          ],
        };
        const payload = {
          challengeIndex: 1,
          prevContainerId: "tagBlockContainer",
          containerId: containerChild._id,
          containerIndex: 0,
          itemId: targetGrandChild._id,
          stageId: "elementTree1",
        };

        const updatedState = reducer(prevState, addChildTree(payload));

        expect(updatedState.challenges[payload.challengeIndex]).toMatchObject({
          stageId: "elementTree1",
          elementTree: {
            _id: "elementTree1",
            isCompleted: false,
            childTrees: [containerChild, otherChild],
            boilerplate: {
              childTrees: [
                {
                  ...containerChild,
                  childTrees: [targetGrandChild],
                },
                otherChild,
              ],
            },
            tagBlockContainer: {
              childTrees: [],
            },
          },
        });
      });
    });
  });

  describe("resetStage", () => {
    test("should reset stage", () => {
      const [targetChild, otherChild] = nestedChallenge.elementTree.childTrees;
      const prevState = {
        isListLoading: false,
        isChallengeLoading: false,
        selectedIndex: 1,
        challenges: [
          tutorialData,
          {
            _id: "nestedChallenge",
            name: "nested",
            isLoaded: true,
            stageId: "elementTree1",
            elementTree: {
              _id: "elementTree1",
              block: { _id: "elementTree1Block" },
              childTrees: [targetChild, otherChild],
              boilerplate: {
                _id: "elementTree1",
                block: { _id: "elementTree1Block" },
                childTrees: [otherChild],
              },
              tagBlockContainer: {
                _id: "tagBlockContainer",
                childTrees: [targetChild],
              },
            },
          },
        ],
      };

      const updatedState = reducer(prevState, resetStage("elementTree1"));

      expect(updatedState.challenges[1]).toMatchObject({
        _id: "nestedChallenge",
        name: "nested",
        isLoaded: true,
        stageId: "elementTree1",
        elementTree: {
          _id: "elementTree1",
          block: { _id: "elementTree1Block" },
          childTrees: [targetChild, otherChild],
          boilerplate: {
            _id: "elementTree1",
            block: { _id: "elementTree1Block" },
            childTrees: [],
          },
          tagBlockContainer: {
            _id: "tagBlockContainer",
            childTrees: [targetChild, otherChild],
          },
        },
      });
    });
  });
});
