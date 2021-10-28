import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Draggable from "../Draggable";
import DropArea from "../DropArea";
import HighlightedTag from "../HighlightedTag";
import { tagBlockSchema } from "../TagBlock";

import { DRAGGABLE_TYPE } from "../../../../constants";

function DropContainer({
  _id, tagName, childTrees, containerId, selectedTagId, isSubChallenge, title,
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
        onClick={isSubChallenge ? () => {} : handleTagClick}
        onKeyPress={isSubChallenge ? () => {} : handleTagClick}
        role="button"
        tabIndex="0"
      >
        <HighlightedTag
          isContainer
          isSubChallenge={isSubChallenge}
          tagName={tagName}
          type="open"
          title={title}
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
                  isSubChallenge={false}
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
                    title={child.title}
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
        onClick={isSubChallenge ? () => {} : handleTagClick}
        onKeyPress={isSubChallenge ? () => {} : handleTagClick}
        role="button"
        tabIndex="0"
      >
        <HighlightedTag
          isContainer
          isSubChallenge={isSubChallenge}
          tagName={tagName}
          type="close"
          title={title}
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
  isSubChallenge: PropTypes.bool.isRequired,
  onDrop: PropTypes.func.isRequired,
  onBlockClick: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  isDropAreaActive: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
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
