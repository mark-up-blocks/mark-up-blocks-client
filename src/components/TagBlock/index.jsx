import React from "react";
import PropTypes from "prop-types";
import { useDrag } from "react-dnd";
import styled from "styled-components";

const TagBlockWrapper = styled.div`
  margin: 10px;
  padding: 10px;
  border: 1px solid gray;
  cursor: pointer;
`;

function TagBlock({ _id, block, childTrees }) {
  const { tagName, isContainer, property } = block;
  const content = isContainer
    ? `<${tagName} />`
    : `<${tagName}>${property.text}</${tagName}>`;

  const [, dragRef] = useDrag(
    () => ({
      type: isContainer ? "tag" : "container",
      item: { _id, block, childTrees },
    }), [_id, content],
  );

  return (
    <TagBlockWrapper ref={dragRef}>
      {content}
    </TagBlockWrapper>
  );
}

const tagBlockTreeShape = {
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

TagBlock.propTypes = {
  ...tagBlockTreeShape,
  childTrees: PropTypes.arrayOf(PropTypes.shape({
    ...tagBlockTreeShape,
  })),
};

TagBlock.defaultProps = {
  childTrees: [],
};

export default TagBlock;
