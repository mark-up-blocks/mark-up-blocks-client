const inOrderChildTrees = ["tomato", "gold", "lightseagreen"].map((color) => ({
  _id: `tutorial-in-order-${color}`,
  title: `tutorial-in-order-${color}`,
  isSubChallenge: false,
  block: {
    _id: `tutorial-in-order-${color}-block`,
    tagName: "span",
    isContainer: false,
    property: {
      style: {
        width: "30px",
        height: "30px",
        backgroundColor: color,
        borderRadius: "50%",
      },
    },
  },
  childTrees: [],
}));

const sampleBlock = {
  _id: "tutorial-in-order",
  title: "in order",
  isSubChallenge: true,
  block: {
    _id: "tutorial-in-order-block",
    tagName: "div",
    isContainer: true,
    property: {
      style: {
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: "200px",
        height: "40px",
      },
    },
  },
  childTrees: inOrderChildTrees,
};

const elementTree = {
  _id: "tutorialTree",
  title: "drag",
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
  stageId: "tutorialTree",
  isLoaded: true,
  elementTree,
};

export { sampleBlock };
export default tutorialData;
