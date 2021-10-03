import React from "react";
import PropTypes from "prop-types";

import Draggable from "../Draggable";
import Droppable from "../Droppable";
import TagBlock from "../TagBlock";

function DropContainer({ _id, childTrees }) {
  return (
    <Droppable _id={_id}>
      <span>&lt;div&gt;</span>
      <>
        {childTrees.map((child) => (
          <Draggable key={child._id} _id={child._id} type={child.block.isContainer ? "container" : "tag"}>
            {child.block.isContainer
              ? <DropContainer _id={child._id} childTrees={child.childTrees} />
              : <span>{`<${child.block.tagName}>${child.block.property.text}</${child.block.tagName}>`}</span>}
          </Draggable>
        ))}
      </>
      <span>&lt;/div&gt;</span>
    </Droppable>
  );
}

DropContainer.propTypes = {
  _id: PropTypes.string.isRequired,
  childTrees: PropTypes.arrayOf(
    PropTypes.shape(TagBlock.propTypes),
  ).isRequired,
};

export default DropContainer;
