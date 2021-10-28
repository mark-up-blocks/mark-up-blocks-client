import React from "react";
import { useSelector } from "react-redux";
import { useDragLayer } from "react-dnd";
import styled from "styled-components";

import HighlightedTag from "../HighlightedTag";
import { selectBlockTreeById } from "../../../../helpers/globalSelectors";
import { getItemStyles } from "../../../../helpers/dataFormatters";

function getTagType(blockTree) {
  if (blockTree.isSubChallenge) {
    return "stage";
  }

  if (blockTree.block.isContainer) {
    return "container";
  }

  return "tag";
}

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
  const blockTree = useSelector(
    (state) => selectBlockTreeById(state, item?.prevContainerId, item?.itemId),
  );
  const tagType = blockTree ? getTagType(blockTree) : "tag";

  if (!isDragging) {
    return null;
  }

  return (
    <Layer>
      <span style={getItemStyles(initialOffset, currentOffset)} className="dragging-content">
        {blockTree && (
        <HighlightedTag
          tagType={tagType}
          tagName={blockTree.block.tagName}
          text={tagType === "stage" ? blockTree.title : blockTree.block.property.text}
        />
        )}
      </span>
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
