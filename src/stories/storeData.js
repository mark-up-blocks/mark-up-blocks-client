const empty = {
  title: "",
  tagBlocks: [],
  boilerplate: null,
  answer: null,
};

const defaultChallenge = {
  title: "default",
  tagBlocks: [],
  boilerplate: null,
  answer: {
    _id: "id2",
    block: {
      tagName: "div",
      property: {
        text: "Nested",
        style: {
          border: "1px solid gray",
        },
      },
    },
    childTrees: [
      {
        _id: "child1",
        block: {
          tagName: "span",
          property: {
            text: "Child1",
            style: {
              margin: "5px",
              border: "1px solid blue",
              backgroundColor: "lightblue",
            },
          },
        },
        childTrees: [],
      },
      {
        _id: "child2",
        block: {
          tagName: "div",
          property: {
            text: "Child2",
            style: {
              margin: "5px",
              border: "1px solid blue",
              backgroundColor: "lightblue",
            },
          },
        },
        childTrees: [
          {
            _id: "grandchild1",
            block: {
              tagName: "span",
              property: {
                text: "Grandchild1",
                style: {
                  margin: "5px",
                  border: "1px solid green",
                  backgroundColor: "lightgreen",
                },
              },
            },
            childTrees: [],
          },
        ],
      },
    ],
  },
};

export default { empty, defaultChallenge };
