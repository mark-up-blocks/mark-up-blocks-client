import React, { createElement } from "react";
import PropTypes from "prop-types";

function ElementBlock({ _id, block, childTrees }) {
  const { tagName, property } = block;

  return createElement(
    tagName,
    { ...property, key: _id },
    property.text,
    childTrees.map((child) => (
      <ElementBlock
        key={child._id}
        _id={child._id}
        block={child.block}
        childTrees={child.childTrees}
      />
    )),
  );
}

const blockTreeShape = {
  _id: PropTypes.string.isRequired,
  block: PropTypes.shape({
    tagName: PropTypes.string.isRequired,
    property: PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.objectOf(PropTypes.string),
      ]).isRequired,
    ),
  }).isRequired,
};

ElementBlock.propTypes = {
  ...blockTreeShape,
  childTrees: PropTypes.arrayOf(PropTypes.shape(blockTreeShape)),
};

ElementBlock.defaultProps = {
  childTrees: [],
};

export default ElementBlock;
