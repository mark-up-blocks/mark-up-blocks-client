import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import CustomDragLayer from "./CustomDragLayer";
import TagBlock, { tagBlockSchema } from "./TagBlock";
import DropArea from "./DropArea";
import DropContainer from "./DropContainer";
import Preview from "./Preview";

import { usePick } from "../../../hooks/usePick";
import { TYPE, DRAGGABLE_TYPE } from "../../../constants";

function DndInterface({
  tagBlockContainer, boilerplate, onDrop, className,
}) {
  const {
    picked, onPick, onUnpick, onReset,
  } = usePick();
  const handleClickDrop = ({ index, containerId }) => {
    if (!picked._id) {
      return;
    }

    if (containerId === picked.containerId && containerId === TYPE.TAG_BLOCK_CONTAINER) {
      return;
    }

    onReset();
    onDrop({
      itemId: picked._id,
      prevContainerId: picked.containerId,
      index,
      containerId,
    });
  };
  const handleDrop = (data) => {
    onReset();
    onDrop(data);
  };

  return (
    <DndInterfaceWrapper className={className}>
      <CustomDragLayer />
      <TagBlockContainer>
        {picked.enablePreview && (
        <Preview
          isSubChallenge={picked.isSubChallenge}
          block={picked.block}
          childTrees={picked.childTrees}
          className="preview"
          position={picked.position}
          onClick={onUnpick}
        />
        )}
        <DropArea
          _id={TYPE.TAG_BLOCK_CONTAINER}
          index={-1}
          onDrop={handleDrop}
          onClick={handleClickDrop}
          className="tag-block-container-drop-area"
        />
        <div className="flex-wrap">
          {tagBlockContainer.childTrees.map(({
            _id, block, isSubChallenge, title,
          }) => (
            <TagBlock
              _id={_id}
              key={_id}
              containerId={TYPE.TAG_BLOCK_CONTAINER}
              tagName={block.tagName}
              isSubChallenge={isSubChallenge}
              isContainer={block.isContainer}
              text={block.property.text || ""}
              className={`tag-block ${picked._id === _id ? "selected-tag-block" : "swing"}`}
              type={block.isContainer ? DRAGGABLE_TYPE.CONTAINER : DRAGGABLE_TYPE.TAG}
              onMouseOver={(data) => onPick(data, "hover")}
              onMouseOut={onUnpick}
              onClick={(data) => onPick(data, "click")}
              title={title}
            />
          ))}
        </div>
      </TagBlockContainer>
      <HTMLViewer>
        <LineNumberSpace />
        <DropContainer
          _id={boilerplate._id}
          containerId={boilerplate._id}
          childTrees={boilerplate.childTrees}
          tagName={boilerplate.block.tagName}
          isSubChallenge
          onDrop={handleDrop}
          onClick={handleClickDrop}
          onBlockClick={(data) => onPick(data, "click")}
          selectedTagId={picked._id}
          isDropAreaActive={!!picked._id}
          title={boilerplate.title}
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
    title: PropTypes.string.isRequired,
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

const DndInterfaceWrapper = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: 1fr 1fr;

  @media screen and (max-width: ${({ theme }) => theme.screenSize.maxWidth.mobile}), {
    grid-template-columns: 1fr;
    grid-auto-flow: row;
  }

  .dragging .swing {
    animation: none;
    background-color: ${({ theme }) => theme.color.point};
  }

  .challenge-tag {
    color: ${({ theme }) => theme.color.challengeTag};
  }

  .parent-tag {
    color: ${({ theme }) => theme.color.parentTag};
  }

  .selected-tag {
    color: ${({ theme }) => theme.color.point};
  }

  .child-tag {
    color: ${({ theme }) => theme.color.childTag};
  }
`;

const TagBlockContainer = styled.div`
  position: relative;
  display: flex;
  padding: 10px;
  justify-content: center;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.color.border};
  border-right: 1px solid ${({ theme }) => theme.color.border};
  border-bottom: 1px solid ${({ theme }) => theme.color.border};

  .tag-block-container-drop-area {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .flex-wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .tag-block {
    position: relative;
  }

  .selected-tag-block {
    background-color: ${({ theme }) => theme.color.preview};
  }
`;

const HTMLViewer = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 30px auto;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.color.border};
  border-right: 1px solid ${({ theme }) => theme.color.border};
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
  counter-reset: line;

  @media screen and (max-width: ${({ theme }) => theme.screenSize.maxWidth.mobile}), {
    border-top: none;
  }

  .dragging * {
    color: ${({ theme }) => theme.color.point};
  }

  .tag-text::before {
    position: absolute;
    right: 100%;
    margin-right: -20px;
    text-align: right;
    font-size: 0.8rem;
    counter-increment: line;
    content: counter(line);
    color: ${({ theme }) => theme.color.inactive};
  }
`;

const LineNumberSpace = styled.div`
  width: 28px;
  height: 100%;
  margin-right: 5px;
  background-color: ${({ theme }) => theme.color.main};
`;

export default DndInterface;
