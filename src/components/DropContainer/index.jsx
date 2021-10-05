import React from "react";
import PropTypes from "prop-types";

import Draggable from "../Draggable";
import Droppable from "../Droppable";
import TagBlock from "../TagBlock";

function DropContainer({ _id, tagName, childTrees }) {
  function getValue(child) {
    return child.isElementCluster
      ? `<${child.block.tagName} />`
      : `<${child.block.tagName}>${child.block.property.text}</${child.block.tagName}>`;
  }

  return (
    <div>
      <span>{`<${tagName}>`}</span>
      <>
        <Droppable _id={_id} index={0}>
          <div />
        </Droppable>
        {childTrees.map((child, index) => (
          <Draggable key={child._id} _id={child._id} type={child.block.isContainer ? "container" : "tag"}>
            <>
              {child.block.isContainer && !child.isElementCluster
                ? (
                  <DropContainer
                    _id={child._id}
                    childTrees={child.childTrees}
                    tagName={child.block.tagName}
                  />
                )
                : <span>{getValue(child)}</span>}
              <Droppable _id={_id} index={index + 1}>
                <div />
              </Droppable>
            </>
          </Draggable>
        ))}
      </>
      <span>{`</${tagName}>`}</span>
    </div>
  );
}

DropContainer.propTypes = {
  _id: PropTypes.string.isRequired,
  tagName: PropTypes.string.isRequired,
  childTrees: PropTypes.arrayOf(
    PropTypes.shape(TagBlock.propTypes),
  ).isRequired,
};

export default DropContainer;
