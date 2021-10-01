import React from "react";
import ElementBlock from ".";

export default {
  component: ElementBlock,
  title: "ElementBlock",
};

const Template = ({ _id, block, childTrees }) => (
  <ElementBlock
    _id={_id}
    block={block}
    childTrees={childTrees}
  />
);

Template.propTypes = ElementBlock.propTypes;

export const Default = Template.bind({});

Default.args = {
  _id: "id1",
  block: {
    tagName: "div",
    property: {
      text: "Default",
      style: {
        border: "1px solid gray",
      },
    },
  },
  childTrees: [],
};

export const Nested = Template.bind({});

Nested.args = {
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
};
