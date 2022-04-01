import React from "react";
import PropTypes from "prop-types";
import { useDrop } from "react-dnd";
import styled from "styled-components";

import { DRAGGABLE_TYPE } from "../../../../constants";

function DropArea({
  _id, index, onDrop, onClick, highlightClassName, className, needHighlight,
}) {
  const [{ hovered }, dropRef] = useDrop(() => ({
    accept: Object.values(DRAGGABLE_TYPE),
    drop({ itemId, prevContainerId }, monitor) {
      if (monitor.didDrop()) {
        return;
      }

      if (itemId === _id) {
        return;
      }

      onDrop({
        itemId, containerId: _id, index, prevContainerId,
      });
    },
    collect(monitor) {
      return { hovered: monitor.isOver({ shallow: true }) };
    },
  }), [_id, index]);

  const handleClick = () => onClick({ containerId: _id, index });

  return (
    <Area
      ref={dropRef}
      className={className}
      onClick={handleClick}
    >
      <Highlight className={highlightClassName} isHighlighted={hovered && needHighlight} />
    </Area>
  );
}

DropArea.propTypes = {
  _id: PropTypes.string.isRequired,
  index: PropTypes.number,
  onDrop: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  highlightClassName: PropTypes.string,
  className: PropTypes.string,
  needHighlight: PropTypes.bool,
};

DropArea.defaultProps = {
  index: -1,
  highlightClassName: "",
  className: "",
  needHighlight: false,
};

const Area = styled.div`
  cursor: pointer;
`;

const Highlight = styled.div`
  padding: 2px;
  margin-top: -3px;
  background-color: ${({ isHighlighted, theme }) => (isHighlighted ? theme.color.preview : "transparent")};
`;

export default DropArea;
