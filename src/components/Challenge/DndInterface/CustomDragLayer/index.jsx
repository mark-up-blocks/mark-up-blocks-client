import React from "react";
import { useSelector } from "react-redux";
import { useDragLayer } from "react-dnd";
import styled from "styled-components";

import HighlightedTag from "../HighlightedTag";
import { selectBlockTreeById } from "../../../../helpers/globalSelectors";
import { getItemStyles } from "../../../../helpers/dataFormatters";

function CustomDragLayer() {
  const {
    isDragging, item, initialOffset, clientOffset,
  } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    clientOffset: monitor.getClientOffset(),
    isDragging: monitor.isDragging(),
  }));
  const blockTree = useSelector(
    (state) => selectBlockTreeById(state, item?.prevContainerId, item?.itemId),
  );

  if (!isDragging) {
    return null;
  }

  return (
    <Layer>
      <TagWrapper style={getItemStyles(initialOffset, clientOffset)}>
        {blockTree && (
        <HighlightedTag
          tagType={blockTree.tagType}
          tagName={blockTree.block.tagName}
          text={blockTree.tagType === "stage" ? blockTree.title : blockTree.block.property.text}
        />
        )}
      </TagWrapper>
    </Layer>
  );
}

const Layer = styled.div`
  position: fixed;
  display: flex;
  z-index: 1;
  pointer-events: none;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

const TagWrapper = styled.div`
  position: fixed;
`;

export default CustomDragLayer;
