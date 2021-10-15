import React, { useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Draggable from "../Draggable";
import { formatTagName } from "../../../../helpers/dataFormatters";

import { DRAGGABLE_TYPE } from "../../../../constants";

function TagBlock({
  _id, isSubChallenge, block, containerId, childTrees, className, onMouseOver, onMouseOut, onClick,
}) {
  const ref = useRef(null);
  const { tagName, isContainer, property } = block;
  const content = formatTagName(isContainer, tagName, property.text);
  const handleMouseOver = () => {
    const position = ref?.current ? ref.current.getBoundingClientRect() : {};

    onMouseOver({
      isSubChallenge, block, childTrees, position,
    });
  };

  return (
    <TagBlockWrapper
      className={`swing ${className}`}
      onMouseOver={handleMouseOver}
      onMouseOut={onMouseOut}
      ref={ref}
      onClick={onClick}
    >
      <Draggable
        _id={_id}
        type={isContainer ? DRAGGABLE_TYPE.CONTAINER : DRAGGABLE_TYPE.TAG}
        containerId={containerId}
      >
        <span>{content}</span>
      </Draggable>
    </TagBlockWrapper>
  );
}

export const tagBlockSchema = {
  _id: PropTypes.string.isRequired,
  isSubChallenge: PropTypes.bool.isRequired,
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
  ...tagBlockSchema,
  containerId: PropTypes.string.isRequired,
  childTrees: PropTypes.arrayOf(
    PropTypes.shape(tagBlockSchema),
  ),
  className: PropTypes.string,
  onMouseOver: PropTypes.func,
  onMouseOut: PropTypes.func,
  onClick: PropTypes.func,
};

TagBlock.defaultProps = {
  childTrees: [],
  className: "",
  onMouseOver: () => {},
  onMouseOut: () => {},
  onClick: () => {},
};

export default TagBlock;

const TagBlockWrapper = styled.div`
  border-radius: 10px;
  border: 1px solid gray;
  margin: 10px;
`;
