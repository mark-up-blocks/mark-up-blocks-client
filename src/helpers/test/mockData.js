const mockChallengeList = [
  {
    _id: "flatChallenge",
    name: "flat",
    elementTree: "elementTree0",
  },
  {
    _id: "nestedChallenge",
    name: "nested",
    elementTree: "elementTree1",
  },
  {
    _id: "deeplyNestedChallenge",
    name: "deeply nested",
    elementTree: "elementTree2",
  },
];

const flatChallenge = {
  _id: "flatChallenge",
  name: "flat",
  elementTree: {
    _id: "elementTree0",
    title: "layout",
    isSubChallenge: true,
    block: {
      _id: "elementTree0Block",
      tagName: "div",
      isContainer: "true",
      property: {
        style: {
          display: "grid",
        },
      },
    },
    childTrees: [{
      _id: "elementTree0Child",
      title: "elementTree0Child",
      isSubChallenge: false,
      block: {
        _id: "elementTree0ChildBlock",
        tagName: "span",
        isContainer: false,
        property: {
          style: {
            backgroundColor: "gray",
          },
        },
      },
      childTrees: [],
    }],
  },
};

const nestedChallenge = {
  _id: "nestedChallenge",
  name: "nested",
  elementTree: {
    _id: "elementTree1",
    title: "layout",
    isSubChallenge: true,
    block: {
      _id: "elementTree1Block",
      tagName: "div",
      isContainer: "true",
      property: {
        style: {
          display: "flex",
        },
      },
    },
    childTrees: [
      {
        _id: "elementTree1Child",
        title: "elementTree1Child",
        isSubChallenge: true,
        block: {
          _id: "elementTree1ChildBlock",
          tagName: "div",
          isContainer: true,
          property: {
            style: {
              border: "1px solid gray",
            },
          },
        },
        childTrees: [{
          _id: "elementTree1GrandChild",
          title: "elementTree1GrandChild",
          isSubChallenge: false,
          block: {
            _id: "elementTree1GrandChildBlock",
            tagName: "span",
            isContainer: false,
            property: {
              style: {
                backgroundColor: "gray",
              },
            },
          },
          childTrees: [],
        }],
      },
      {
        _id: "elementTree1Child2",
        title: "elementTree1Child2",
        isSubChallenge: false,
        block: {
          _id: "elementTree1Child2Block",
          tagName: "div",
          isContainer: false,
          property: {
            style: {
              border: "1px solid blue",
            },
          },
        },
        childTrees: [],
      },
    ],
  },
};

const deeplyNestedChallenge = {
  _id: "nestedChallenge",
  name: "nested",
  elementTree: {
    _id: "elementTree2",
    title: "layout",
    isSubChallenge: true,
    block: {
      _id: "elementTree2Block",
      tagName: "div",
      isContainer: true,
      property: {
        style: {
          display: "flex",
        },
      },
    },
    childTrees: [
      {
        _id: "elementTree2Child",
        title: "elementTree2Child",
        isSubChallenge: true,
        block: {
          _id: "elementTree2ChildBlock",
          tagName: "div",
          isContainer: true,
          property: {
            style: {
              border: "1px solid gray",
            },
          },
        },
        childTrees: [{
          _id: "elementTree2GrandChild",
          title: "elementTree2GrandChild",
          isSubChallenge: true,
          block: {
            _id: "elementTree2GrandChildBlock",
            tagName: "div",
            isContainer: true,
            property: {
              style: {
                border: "1px solid red",
              },
            },
          },
          childTrees: [
            {
              _id: "elementTree2GrandGrandChild",
              title: "elementTree2GrandGrandChild",
              isSubChallenge: false,
              block: {
                _id: "elementTree2GrandChildGrandBlock",
                tagName: "span",
                isContainer: false,
                property: {
                  style: {
                    backgroundColor: "skyblue",
                  },
                },
              },
              childTrees: [],
            },
          ],
        }],
      },
      {
        _id: "elementTree2Child2",
        title: "elementTree2Child2",
        isSubChallenge: false,
        block: {
          _id: "elementTree2Child2Block",
          tagName: "div",
          isContainer: true,
          property: {
            style: {
              backgroundColor: "lime",
            },
          },
        },
        childTrees: [
          {
            _id: "elementTree2GrandChild2",
            title: "elementTree2GrandChild2",
            isSubChallenge: false,
            block: {
              _id: "elementTree2GrandChild2Block",
              tagName: "div",
              isContainer: false,
              property: {
                style: {
                  border: "1px solid green",
                },
              },
            },
          },
        ],
      },
    ],
  },
};

export {
  mockChallengeList, flatChallenge, nestedChallenge, deeplyNestedChallenge,
};
