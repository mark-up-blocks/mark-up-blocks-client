import React from "react";
import PropTypes from "prop-types";
import { useDrag } from "react-dnd";
import styled from "styled-components";

function Draggable({ children, _id, type }) {
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type,
      item: { itemId: _id },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
  );

  return (
    <DraggableWrapper ref={dragRef} isDragging={isDragging}>
      {children}
    </DraggableWrapper>
  );
}

Draggable.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  _id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["tag", "container"]).isRequired,
};

export default Draggable;

const DraggableWrapper = styled.div`
  margin: 1px 20px;
  padding: 2px;
  cursor: pointer;
  border: ${({ isDragging }) => (isDragging ? "1px solid gray" : "1px solid transparent")};
`;
