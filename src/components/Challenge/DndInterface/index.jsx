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
      <TagBlockShowcase>
        {picked.enablePreview && (
        <Preview
          tagType={picked.tagType}
          block={picked.block}
          childTrees={picked.childTrees}
          className="preview"
          position={picked.position}
          onClick={onUnpick}
        />
        )}
        <TagBlockShowcaseDropArea
          _id={TYPE.TAG_BLOCK_CONTAINER}
          index={-1}
          onDrop={handleDrop}
          onClick={handleClickDrop}
        />
        <TagBlockContainer>
          {tagBlockContainer.childTrees.map(({
            _id, block, title, tagType,
          }) => (
            <TagBlock
              _id={_id}
              key={_id}
              containerId={TYPE.TAG_BLOCK_CONTAINER}
              tagName={block.tagName}
              tagType={tagType}
              text={tagType === "stage" ? title : block.property.text || ""}
              className={picked._id === _id ? "selected-tag-block" : "swing"}
              type={block.isContainer ? DRAGGABLE_TYPE.CONTAINER : DRAGGABLE_TYPE.TAG}
              onMouseOver={(data) => onPick(data, "hover")}
              onMouseOut={onUnpick}
              onClick={(data) => onPick(data, "click")}
              title={title}
            />
          ))}
        </TagBlockContainer>
      </TagBlockShowcase>
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
    background-color: ${({ theme }) => theme.color.preview};
  }

  .selected-tag {
    color: ${({ theme }) => theme.color.point};
  }
`;

const TagBlockShowcase = styled.div`
  position: relative;
  display: flex;
  padding: 10px;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-left: none;
`;

const TagBlockShowcaseDropArea = styled(DropArea)`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const TagBlockContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  .selected-tag-block {
    position: relative;
    background-color: ${({ theme }) => theme.color.preview};
  }
`;

const HTMLViewer = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 30px auto;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-left: none;
  counter-reset: line;

  @media screen and (max-width: ${({ theme }) => theme.screenSize.maxWidth.mobile}), {
    border-top: none;
  }

  .dragging * {
    color: ${({ theme }) => theme.color.point};
  }
`;

const LineNumberSpace = styled.div`
  width: 28px;
  height: 100%;
  margin-right: 5px;
  background-color: ${({ theme }) => theme.color.main};
`;

export default DndInterface;
