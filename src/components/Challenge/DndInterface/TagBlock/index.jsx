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
      _id, isSubChallenge, block, childTrees, position,
    });
  };
  const handleClick = () => {
    const position = ref?.current ? ref.current.getBoundingClientRect() : {};

    onClick({
      _id, isSubChallenge, block, childTrees, position,
    });
  };

  return (
    <Draggable
      _id={_id}
      type={isContainer ? DRAGGABLE_TYPE.CONTAINER : DRAGGABLE_TYPE.TAG}
      containerId={containerId}
      content={content}
    >
      <TagBlockWrapper
        className={className}
        onMouseOver={handleMouseOver}
        onMouseOut={onMouseOut}
        ref={ref}
        onClick={handleClick}
      >
        <span>{content}</span>
      </TagBlockWrapper>
    </Draggable>
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
  padding: 3px 20px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.color.point};
`;
