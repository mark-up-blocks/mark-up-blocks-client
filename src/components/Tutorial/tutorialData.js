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

const sampleBoilerplate = {
  _id: "tutorial",
  title: "tutorial",
  isSubChallenge: true,
  block: {
    _id: "tutorialBoxBlock",
    tagName: "div",
    isContainer: true,
    property: {},
  },
  childTrees: [],
};

const tutorialData = {
  _id: "tutorialChallenge",
  name: "tutorialChallenge",
  elementTree: {
    ...sampleBoilerplate,
    childTrees: [sampleBlock],
  },
};

export default tutorialData;
export { sampleBlock, sampleBoilerplate };
