import React from "react";
import PropTypes from "prop-types";
import { useDrag } from "react-dnd";
import styled from "styled-components";

const DraggableWrapper = styled.div`
  margin: 2px 10px;
  padding: 2px;
  cursor: pointer;
  border: 1px solid transparent;

  &:hover {
    border: 1px solid gray;
  }
`;

function Draggable({ children, _id, type }) {
  const [, dragRef] = useDrag(
    () => ({ type, item: { itemId: _id } }),
  );

  return (
    <DraggableWrapper ref={dragRef}>
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
