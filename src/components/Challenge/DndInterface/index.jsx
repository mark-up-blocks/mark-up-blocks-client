import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import CustomDragLayer from "./CustomDragLayer";
import TagBlock, { tagBlockSchema } from "./TagBlock";
import Droppable from "./Droppable";
import DropContainer from "./DropContainer";
import Preview from "./Preview";

import { TYPE } from "../../../constants";

function DndInterface({
  tagBlockContainer, boilerplate, onDrop, className,
}) {
  const [selectedBlock, setSelectedBlock] = useState(null);
  const handleBlockSelect = (selected) => {
    if (selectedBlock?.isClicked) {
      return;
    }

    const {
      _id, isSubChallenge, block, childTrees, position,
    } = selected;

    if (!position) {
      return;
    }

    setSelectedBlock({
      _id, isSubChallenge, block, childTrees, position,
    });
  };
  const handleBlockUnselect = () => {
    if (selectedBlock?.isClicked) {
      return;
    }

    setSelectedBlock(null);
  };
  const handlePreviewClick = () => {
    setSelectedBlock(null);
  };
  const handleDrop = (params) => {
    handlePreviewClick();
    onDrop(params);
  };
  const handleDroppableClick = (params) => {
    const { containerId, index } = params;

    if (!selectedBlock || !selectedBlock.isClicked) {
      return;
    }

    if (containerId === TYPE.TAG_BLOCK_CONTAINER) {
      return;
    }

    onDrop({
      itemId: selectedBlock._id, containerId, index, prevContainerId: TYPE.TAG_BLOCK_CONTAINER,
    });
    setSelectedBlock(null);
  };
  const handleBlockClick = (selected) => {
    setSelectedBlock((prevSelected) => {
      if (prevSelected?._id === selected?._id && prevSelected.isClicked) {
        return null;
      }

      return { ...selected, isClicked: true };
    });
  };

  return (
    <DndInterfaceWrapper className={className}>
      <CustomDragLayer />
      <Droppable
        _id={TYPE.TAG_BLOCK_CONTAINER}
        className="tag-block-container-droppable"
        hoveredClassName="tag-block-container-droppable"
        onDrop={handleDrop}
        onClick={handleDroppableClick}
      >
        {selectedBlock && (
          <Preview
            isSubChallenge={selectedBlock.isSubChallenge}
            block={selectedBlock.block}
            childTrees={selectedBlock.childTrees}
            className="preview"
            position={selectedBlock.position}
            onClick={handlePreviewClick}
          />
        )}
        <TagBlockContainer>
          <>
            {tagBlockContainer.childTrees.map(({
              _id, isSubChallenge, block, childTrees,
            }, index) => (
              <Droppable
                _id={TYPE.TAG_BLOCK_CONTAINER}
                key={_id}
                index={index}
                onDrop={handleDrop}
                onClick={handleDroppableClick}
              >
                <TagBlock
                  _id={_id}
                  block={block}
                  isSubChallenge={isSubChallenge}
                  containerId={TYPE.TAG_BLOCK_CONTAINER}
                  childTrees={childTrees}
                  onMouseOver={handleBlockSelect}
                  onMouseOut={handleBlockUnselect}
                  onClick={handleBlockClick}
                  className={_id === selectedBlock?._id ? "selected" : "swing"}
                />
              </Droppable>
            ))}
          </>
        </TagBlockContainer>
      </Droppable>
      <HTMLViewer>
        <LineNumberSpace />
        <DropContainer
          _id={boilerplate._id}
          childTrees={boilerplate.childTrees}
          tagName={boilerplate.block.tagName}
          onDrop={handleDrop}
          onClick={handleDroppableClick}
          droppableClassName={selectedBlock ? "drop-guide" : ""}
          droppableHoveredClassName="selected"
        />
      </HTMLViewer>
    </DndInterfaceWrapper>
  );
}

DndInterface.propTypes = {
  tagBlockContainer: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    childTrees: PropTypes.arrayOf(
      PropTypes.shape(tagBlockSchema),
    ).isRequired,
  }).isRequired,
  boilerplate: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    childTrees: PropTypes.arrayOf(
      PropTypes.shape(tagBlockSchema),
    ).isRequired,
    block: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      tagName: PropTypes.string.isRequired,
    }),
  }).isRequired,
  onDrop: PropTypes.func.isRequired,
  className: PropTypes.string,
};

DndInterface.defaultProps = {
  className: "",
};

export default DndInterface;

const DndInterfaceWrapper = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: 1fr 1fr;

  @media screen and (max-width: ${({ theme }) => theme.screenSize.maxWidth.mobile}), {
    grid-template-columns: 1fr;
    grid-auto-flow: row;
  }

  .tag-block-container-droppable {
    position: relative;
    display: flex;
    margin: 10px;
    justify-content: center;
    align-items: center;
    border: ${({ theme }) => theme.border.container};
    border-radius: ${({ theme }) => theme.border.radius.container};
  }

  .dragging .swing {
    animation: none;
    background-color: ${({ theme }) => theme.color.point};
  }
`;

const TagBlockContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const HTMLViewer = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 30px auto;
  align-items: center;
  margin: 10px;
  border: ${({ theme }) => theme.border.container};
  border-radius: ${({ theme }) => theme.border.radius.container};
  counter-reset: line;

  .tag-text::before {
    position: absolute;
    right: 100%;
    margin-right: -20px;
    text-align: right;
    counter-increment: line;
    content: counter(line);
    color: ${({ theme }) => theme.color.inner};
  }
`;

const LineNumberSpace = styled.div`
  width: 28px;
  height: 100%;
  margin-right: 5px;
  background-color: ${({ theme }) => theme.color.main};
`;
