const sampleBlock = {
  _id: "tutorial1",
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
  hasUsed: false,
  isChallenge: false,
};

const sampleBoilerplate = {
  _id: "tutorialBox",
  block: { tagName: "div" },
  childTrees: [],
};

export { sampleBlock, sampleBoilerplate };
