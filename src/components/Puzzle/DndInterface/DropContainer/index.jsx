import React from "react";
import PropTypes from "prop-types";

import Draggable from "../Draggable";
import Droppable from "../Droppable";
import TagBlock from "../TagBlock";

function DropContainer({
  _id, tagName, childTrees, onDrop,
}) {
  function getTextValue(child) {
    return child.isSubChallenge
      ? `<${child.block.tagName} />`
      : `<${child.block.tagName}>${child.block.property.text}</${child.block.tagName}>`;
  }

  return (
    <div>
      <span>{`<${tagName}>`}</span>
      <>
        <Droppable _id={_id} index={0} onDrop={onDrop}>
          <div />
        </Droppable>
        {childTrees.map((child, index) => (
          <Draggable key={child._id} _id={child._id} type={child.block.isContainer ? "container" : "tag"} containerId={_id}>
            <>
              {child.block.isContainer && !child.isSubChallenge
                ? (
                  <DropContainer
                    _id={child._id}
                    childTrees={child.childTrees}
                    tagName={child.block.tagName}
                    onDrop={onDrop}
                  />
                )
                : <span>{getTextValue(child)}</span>}
              <Droppable _id={_id} index={index + 1} onDrop={onDrop}>
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
    PropTypes.shape({ ...TagBlock.propTypes, containerId: null }),
  ).isRequired,
  onDrop: PropTypes.func.isRequired,
};

export default DropContainer;
