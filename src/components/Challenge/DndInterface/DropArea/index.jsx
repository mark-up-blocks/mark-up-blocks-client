import React from "react";
import PropTypes from "prop-types";
import { useDrop } from "react-dnd";
import styled from "styled-components";

import { DRAGGABLE_TYPE } from "../../../../constants";

function DropArea({
  _id, index, onDrop, onClick, className, needHighlight,
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
      hovered={hovered && needHighlight}
      onClick={handleClick}
    />
  );
}

DropArea.propTypes = {
  _id: PropTypes.string.isRequired,
  index: PropTypes.number,
  onDrop: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  needHighlight: PropTypes.bool,
};

DropArea.defaultProps = {
  index: -1,
  className: "",
  needHighlight: false,
};

const Area = styled.div`
  padding: 3px 0;
  background-color: ${({ hovered, theme }) => (hovered ? theme.color.point : "transparent")};
  cursor: pointer;
`;

export default DropArea;
