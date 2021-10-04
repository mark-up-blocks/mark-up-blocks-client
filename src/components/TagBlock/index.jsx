import React from "react";
import PropTypes from "prop-types";
import Draggable from "../Draggable";

function TagBlock({ _id, block }) {
  const { tagName, isContainer, property } = block;
  const content = isContainer
    ? `<${tagName} />`
    : `<${tagName}>${property.text}</${tagName}>`;

  return (
    <Draggable _id={_id} type={isContainer ? "tag" : "container"}>
      <span>{content}</span>
    </Draggable>
  );
}

TagBlock.propTypes = {
  _id: PropTypes.string.isRequired,
  block: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    tagName: PropTypes.string.isRequired,
    isContainer: PropTypes.bool.isRequired,
    property: PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.objectOf(PropTypes.string),
      ]).isRequired,
    ).isRequired,
  }).isRequired,
};

export default TagBlock;
