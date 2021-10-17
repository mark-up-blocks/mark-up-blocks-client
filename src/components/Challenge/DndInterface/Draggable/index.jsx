import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useDrag } from "react-dnd";
import styled from "styled-components";

import { DRAGGABLE_TYPE } from "../../../../constants";

function Draggable({
  children, _id, type, containerId, content,
}) {
  const [{ isDragging }, dragRef, dragPreview] = useDrag(() => ({
    type,
    item: { itemId: _id, prevContainerId: containerId, content },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  useEffect(() => {
    dragPreview(getEmptyImage(), { captureDraggingState: true });
    // disable default preview for using custom drag layer. reference https://react-dnd.github.io/react-dnd/examples/drag-around/custom-drag-layer
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DraggableWrapper ref={dragRef} className={isDragging ? "dragging" : ""}>
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
  type: PropTypes.oneOf(Object.values(DRAGGABLE_TYPE)).isRequired,
  containerId: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default Draggable;

const DraggableWrapper = styled.div`
  margin: 1px 20px;
  padding: 2px;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.border.radius.container};
`;
