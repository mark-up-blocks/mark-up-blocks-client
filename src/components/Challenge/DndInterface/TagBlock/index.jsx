import React, { useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Draggable from "../Draggable";
import HighlightedTag from "../HighlightedTag";

import { DRAGGABLE_TYPE } from "../../../../constants";

function TagBlock({
  _id, type, containerId, className, onMouseOver, onMouseOut, onClick,
  tagName, text, tagType,
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
          tagType={tagType}
          tagName={tagName}
          text={text}
        />
      </TagBlockWrapper>
    </Draggable>
  );
}

TagBlock.propTypes = {
  _id: PropTypes.string.isRequired,
  tagName: PropTypes.string.isRequired,
  tagType: PropTypes.oneOf(["stage", "container", "tag"]).isRequired,
  text: PropTypes.string.isRequired,
  type: PropTypes.oneOf(Object.values(DRAGGABLE_TYPE)).isRequired,
  containerId: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  onMouseOver: PropTypes.func.isRequired,
  onMouseOut: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

const TagBlockWrapper = styled.div`
  padding: 5px 20px;
  margin: 5px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.color.point};
`;

export default TagBlock;
