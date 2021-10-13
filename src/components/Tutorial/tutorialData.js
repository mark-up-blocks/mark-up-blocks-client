import { generateBlocks } from "../../helpers/tagBlockGenerators";
import { TYPE } from "../../constants";

const sampleBlock = {
  _id: "tutorial1",
  title: "tutorialBlock",
  isSubChallenge: false,
  block: {
    _id: "tutorial1",
    tagName: "p",
    isContainer: false,
    property: {
      text: "Move me",
      style: {
        width: "100px",
        height: "30px",
        backgroundColor: "gold",
      },
    },
  },
  childTrees: [],
};

const elementTree = {
  _id: "tutorialTree",
  title: "tutorial",
  isSubChallenge: true,
  block: {
    _id: "tutorialTree",
    tagName: "div",
    isContainer: true,
    property: {},
  },
  childTrees: [sampleBlock],
};

const tutorialData = {
  _id: "tutorial",
  name: "tutorial",
  selectedSubChallengeId: "tutorialTree",
  elementTree: {
    ...elementTree,
    boilerplate: { ...elementTree, childTrees: [] },
    tagBlockContainer: {
      _id: TYPE.TAG_BLOCK_CONTAINER,
      childTrees: generateBlocks(elementTree),
    },
    isLoaded: true,
  },
};

export default tutorialData;
