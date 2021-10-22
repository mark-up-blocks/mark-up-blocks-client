import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Draggable from "../Draggable";
import DropArea from "../DropArea";
import HighlightedTag from "../HighlightedTag";
import { tagBlockSchema } from "../TagBlock";

import { DRAGGABLE_TYPE } from "../../../../constants";

function DropContainer({
  _id, tagName, childTrees, containerId, selectedTagId,
  onDrop, onClick, onBlockClick,
  className, isDropAreaActive,
}) {
  const handleTagClick = () => {
    onBlockClick({ _id, containerId, isClicked: true });
  };

  return (
    <DropContainerWrapper className={className}>
      <div
        className="tag-text"
        onClick={handleTagClick}
        onKeyPress={handleTagClick}
        role="button"
        tabIndex="0"
      >
        <HighlightedTag
          isContainer
          isSubChallenge={false}
          tagName={tagName}
          type="open"
        />
      </div>
      <DropArea
        _id={_id}
        onDrop={onDrop}
        index={0}
        onClick={onClick}
        className={`first-drop-area ${isDropAreaActive ? "drop-guide" : ""}`}
        needHighlight
      />
      <>
        {childTrees.map((child, index) => (
          <Draggable
            _id={child._id}
            key={child._id}
            type={child.block.isContainer ? DRAGGABLE_TYPE.CONTAINER : DRAGGABLE_TYPE.TAG}
            containerId={_id}
          >
            {child.block.isContainer && !child.isSubChallenge
              ? (
                <DropContainer
                  _id={child._id}
                  childTrees={child.childTrees}
                  tagName={child.block.tagName}
                  onDrop={onDrop}
                  onBlockClick={onBlockClick}
                  onClick={onClick}
                  containerId={_id}
                  selectedTagId={selectedTagId}
                  isDropAreaActive={isDropAreaActive}
                />
              )
              : (
                <div
                  className={`tag-text ${selectedTagId === child._id ? "selected-tag" : ""}`}
                  onClick={() => onBlockClick({
                    _id: child._id,
                    containerId: _id,
                    isClicked: true,
                  })}
                  onKeyPress={handleTagClick}
                  role="button"
                  tabIndex="0"
                >
                  <HighlightedTag
                    isContainer={false}
                    isSubChallenge={child.isSubChallenge}
                    tagName={child.block.tagName}
                    text={child.block.property.text}
                  />
                </div>
              )}
            <DropArea
              _id={_id}
              onDrop={onDrop}
              onClick={onClick}
              index={index + 1}
              className={`drop-area ${isDropAreaActive ? "drop-guide" : ""}`}
              needHighlight
            />
          </Draggable>
        ))}
      </>
      <div
        className="tag-text"
        onClick={handleTagClick}
        onKeyPress={handleTagClick}
        role="button"
        tabIndex="0"
      >
        <HighlightedTag
          isContainer
          isSubChallenge={false}
          tagName={tagName}
          type="close"
        />
      </div>
    </DropContainerWrapper>
  );
}

DropContainer.propTypes = {
  _id: PropTypes.string.isRequired,
  containerId: PropTypes.string.isRequired,
  tagName: PropTypes.string.isRequired,
  selectedTagId: PropTypes.string,
  childTrees: PropTypes.arrayOf(
    PropTypes.shape({
      ...tagBlockSchema,
      isCorrect: PropTypes.bool,
    }),
  ).isRequired,
  onDrop: PropTypes.func.isRequired,
  onBlockClick: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  isDropAreaActive: PropTypes.bool.isRequired,
};

DropContainer.defaultProps = {
  selectedTagId: "",
  className: "",
};

const DropContainerWrapper = styled.div`
  .drop-area {
    margin: 4px 0px;
  }

  .first-drop-area {
    margin: 4px 20px;
  }
`;

export default DropContainer;
