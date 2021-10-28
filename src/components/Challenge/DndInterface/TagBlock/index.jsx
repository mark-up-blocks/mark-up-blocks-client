import React, { useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Draggable from "../Draggable";
import HighlightedTag from "../HighlightedTag";

import { DRAGGABLE_TYPE } from "../../../../constants";

function TagBlock({
  _id, type, containerId, className, onMouseOver, onMouseOut, onClick,
  tagName, text, isSubChallenge, isContainer, title,
}) {
  const ref = useRef(null);
  const handleSelect = (func) => {
    const position = ref?.current ? ref.current.getBoundingClientRect() : null;

    func({ _id, position, containerId });
  };

  return (
    <Draggable
      _id={_id}
      type={type}
      containerId={containerId}
    >
      <TagBlockWrapper
        className={className}
        onMouseOver={() => handleSelect(onMouseOver)}
        onMouseOut={onMouseOut}
        ref={ref}
        onClick={() => handleSelect(onClick)}
      >
        <HighlightedTag
          tagName={tagName}
          text={text}
          isSubChallenge={isSubChallenge}
          isContainer={isContainer}
          title={title}
        />
      </TagBlockWrapper>
    </Draggable>
  );
}

TagBlock.propTypes = {
  _id: PropTypes.string.isRequired,
  tagName: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  isSubChallenge: PropTypes.bool.isRequired,
  isContainer: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(Object.values(DRAGGABLE_TYPE)).isRequired,
  containerId: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  onMouseOver: PropTypes.func.isRequired,
  onMouseOut: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

const TagBlockWrapper = styled.div`
  padding: 5px 20px;
  margin: 5px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.color.point};
`;

const tagBlockSchema = {
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

export { tagBlockSchema };
export default TagBlock;
