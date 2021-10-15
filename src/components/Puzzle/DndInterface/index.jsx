import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import TagBlock, { tagBlockSchema } from "./TagBlock";
import Droppable from "./Droppable";
import DropContainer from "./DropContainer";
import Preview from "./Preview";

import { TYPE } from "../../../constants";

function DndInterface({
  tagBlockContainer, boilerplate, onDrop, className,
}) {
  const [hoveredBlock, setHoveredBlock] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const handleBlockHovered = (hovered) => {
    if (!hovered || isClicked) {
      return;
    }

    const {
      isSubChallenge, block, childTrees, position,
    } = hovered;

    if (!position) {
      return;
    }

    setHoveredBlock({
      isSubChallenge, block, childTrees, position,
    });
  };
  const handleBlockUnhovered = () => {
    if (isClicked) {
      return;
    }

    setHoveredBlock(null);
  };
  const handlePreviewClick = () => {
    setIsClicked(false);
    setHoveredBlock(null);
  };
  const handleDrop = (params) => {
    handlePreviewClick();
    onDrop(params);
  };

  return (
    <DndInterfaceWrapper className={className}>
      <Droppable
        _id={TYPE.TAG_BLOCK_CONTAINER}
        className="tag-block-container-droppable"
        hoveredClassName="tag-block-container-droppable"
        onDrop={handleDrop}
      >
        {hoveredBlock && (
        <Preview
          isSubChallenge={hoveredBlock.isSubChallenge}
          block={hoveredBlock.block}
          childTrees={hoveredBlock.childTrees}
          className="preview"
          position={hoveredBlock.position}
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
              >
                <TagBlock
                  _id={_id}
                  block={block}
                  isSubChallenge={isSubChallenge}
                  containerId={TYPE.TAG_BLOCK_CONTAINER}
                  childTrees={childTrees}
                  onMouseOver={handleBlockHovered}
                  onMouseOut={handleBlockUnhovered}
                  onClick={() => setIsClicked((prev) => !prev)}
                />
              </Droppable>
            ))}
          </>
        </TagBlockContainer>
      </Droppable>
      <HTMLViewer>
        <DropContainer
          _id={boilerplate._id}
          childTrees={boilerplate.childTrees}
          tagName={boilerplate.block.tagName}
          onDrop={handleDrop}
          droppableClassName={hoveredBlock ? "drop-guide" : ""}
          droppableHoveredClassName="drop-selected"
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
    grid-template-rows: 1fr 1fr;
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
`;

const TagBlockContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const HTMLViewer = styled.div`
  display: grid;
  align-items: center;
  margin: 10px;
  padding: 10px;
  border: ${({ theme }) => theme.border.container};
  border-radius: ${({ theme }) => theme.border.radius.container};
`;
