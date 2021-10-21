import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import CustomDragLayer from "./CustomDragLayer";
import TagBlock, { tagBlockSchema } from "./TagBlock";
import Droppable from "./Droppable";
import DropContainer from "./DropContainer";
import Preview from "./Preview";

import { TYPE } from "../../../constants";

const initialSelected = {
  _id: "",
  containerId: TYPE.TAG_BLOCK_CONTAINER,
  enablePreview: false,
  isSubChallenge: false,
  block: null,
  childTrees: [],
};

function DndInterface({
  tagBlockContainer, boilerplate, onDrop, className,
}) {
  const [selected, setSelected] = useState(initialSelected);

  const handleSelect = (data, type) => {
    setSelected((prevSelected) => {
      if (!data) {
        return prevSelected;
      }

      const isClicked = type === "click";
      const {
        _id, containerId, isSubChallenge, block, childTrees, position,
      } = data;
      const result = {
        _id, containerId, isSubChallenge, block, childTrees, position, isClicked,
      };
      const isReClick = prevSelected.isClicked && isClicked && prevSelected._id === _id;

      if (prevSelected.isClicked && !isClicked) {
        return prevSelected;
      }

      if (isReClick) {
        return initialSelected;
      }

      result.enablePreview = !!position;

      return result;
    });
  };
  const handleUnselect = () => {
    setSelected((prevSelected) => {
      if (prevSelected.isClicked) {
        return prevSelected;
      }

      return {
        _id: "",
        containerId: "",
        enablePreview: false,
        isSubChallenge: false,
        block: null,
        childTrees: [],
      };
    });
  };
  const handleClickDrop = (data) => {
    const { containerId, index } = data;

    if (!selected._id || !selected.isClicked) {
      return;
    }

    if (containerId === selected.prevContainerId && containerId === TYPE.TAG_BLOCK_CONTAINER) {
      return;
    }

    onDrop({
      itemId: selected._id, containerId, prevContainerId: selected.containerId, index,
    });
  };
  const handlePreviewClick = () => {
    setSelected((prevSelected) => ({ ...prevSelected, enablePreview: false }));
  };

  return (
    <DndInterfaceWrapper className={className}>
      <CustomDragLayer />
      <Droppable
        _id={TYPE.TAG_BLOCK_CONTAINER}
        className="tag-block-container-droppable"
        hoveredClassName="tag-block-container-droppable"
        onDrop={onDrop}
        onClick={handleClickDrop}
      >
        {selected.enablePreview ? (
          <Preview
            isSubChallenge={selected.isSubChallenge}
            block={selected.block}
            childTrees={selected.childTrees}
            className="preview"
            position={selected.position}
            onClick={handlePreviewClick}
          />
        ) : null}
        <TagBlockContainer>
          <>
            {tagBlockContainer.childTrees.map(({
              _id, isSubChallenge, block, childTrees,
            }) => (
              <TagBlock
                _id={_id}
                key={_id}
                block={block}
                isSubChallenge={isSubChallenge}
                containerId={TYPE.TAG_BLOCK_CONTAINER}
                childTrees={childTrees}
                onMouseOver={(data) => handleSelect(data, "hover")}
                onMouseOut={handleUnselect}
                onClick={(data) => handleSelect(data, "click")}
                className={_id === selected?._id ? "selected" : "swing"}
              />
            ))}
          </>
        </TagBlockContainer>
      </Droppable>
      <HTMLViewer>
        <LineNumberSpace />
        <DropContainer
          _id={boilerplate._id}
          containerId={boilerplate._id}
          childTrees={boilerplate.childTrees}
          tagName={boilerplate.block.tagName}
          onDrop={onDrop}
          onClick={handleClickDrop}
          onBlockClick={(data) => handleSelect(data, "click")}
          droppableClassName={selected._id ? "drop-guide" : ""}
          droppableHoveredClassName="selected"
          selectedTagId={selected?._id}
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

  .dragging * {
    color: ${({ theme }) => theme.color.point};
  }

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
