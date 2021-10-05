import React, { createElement } from "react";
import PropTypes from "prop-types";

function ElementBlock({ _id, block, childTrees }) {
  const { tagName, isContainer } = block;

  function preventDefault(event) {
    event.preventDefault();
  }

  const eventHandlers = Object.keys(block.property).filter((attribute) => attribute.startsWith("on"));
  const preventedHandlers = eventHandlers.reduce(
    (accumulator, handler) => ({ ...accumulator, [handler]: preventDefault }),
    {},
  );

  const property = {
    ...block.property, key: _id, ...preventedHandlers, text: null,
  };

  if (tagName === "form") {
    property.onSubmit = preventDefault;
  }

  if (isContainer) {
    return createElement(
      tagName,
      property,
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

  if (["input", "textarea"].includes(tagName)) {
    property.readOnly = true;
  }

  if (block.property.text) {
    return createElement(
      tagName,
      property,
      block.property.text,
    );
  }

  return createElement(
    tagName,
    { ...property, key: _id, ...preventedHandlers },
  );
}

const blockTreeShape = {
  _id: PropTypes.string.isRequired,
  block: PropTypes.shape({
    tagName: PropTypes.string.isRequired,
    isContainer: PropTypes.bool.isRequired,
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
