import React from "react";
import { useDragLayer } from "react-dnd";
import styled from "styled-components";

import { getItemStyles } from "../../../../helpers/dataFormatters";

function CustomDragLayer() {
  const {
    isDragging, item, initialOffset, currentOffset,
  } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging) {
    return null;
  }

  return (
    <Layer>
      <span style={getItemStyles(initialOffset, currentOffset)} className="dragging-content">{item.content}</span>
    </Layer>
  );
}

export default CustomDragLayer;

const Layer = styled.div`
  position: fixed;
  display: flex;
  z-index: 1;
  pointer-events: none;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

  .dragging-content {
    height: 25px;
  }
`;
