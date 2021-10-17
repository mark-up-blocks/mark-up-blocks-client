import React from "react";
import PropTypes from "prop-types";
import { useDrop } from "react-dnd";
import styled from "styled-components";

import { DRAGGABLE_TYPE } from "../../../../constants";

function Droppable({
  children, _id, index, onDrop, onClick, className, hoveredClassName,
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

  const handleClick = () => {
    onClick({ containerId: _id, index });
  };

  return (
    <DroppableWrapper
      className={hovered ? hoveredClassName : className}
      ref={dropRef}
      onClick={handleClick}
    >
      {children}
    </DroppableWrapper>
  );
}

Droppable.propTypes = {
  _id: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  index: PropTypes.number,
  onDrop: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  hoveredClassName: PropTypes.string,
};

Droppable.defaultProps = {
  index: -1,
  className: "",
  hoveredClassName: "",
};

export default Droppable;

const DroppableWrapper = styled.div`
  display: grid;
  margin: 1px 0;
  padding: 3px 0;
  align-content: space-between;
  cursor: pointer;
`;
