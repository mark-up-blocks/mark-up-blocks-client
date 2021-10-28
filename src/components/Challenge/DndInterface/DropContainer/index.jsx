import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Draggable from "../Draggable";
import DropArea from "../DropArea";
import HighlightedTag from "../HighlightedTag";
import { tagBlockSchema } from "../TagBlock";

import { DRAGGABLE_TYPE } from "../../../../constants";

function DropContainer({
  _id, tagName, childTrees, containerId, selectedTagId, isSubChallenge,
  onDrop, onClick, onBlockClick,
  className, isDropAreaActive,
}) {
  const handleTagClick = () => {
    onBlockClick({ _id, containerId, isClicked: true });
  };

  return (
    <div className={className}>
      <TextTag onClick={isSubChallenge ? () => {} : handleTagClick}>
        <HighlightedTag
          tagType="container-open"
          tagName={tagName}
        />
      </TextTag>
      <FirstDropArea
        _id={_id}
        onDrop={onDrop}
        index={0}
        onClick={onClick}
        className={isDropAreaActive ? "drop-guide" : ""}
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
                <TextTag
                  onClick={() => onBlockClick({
                    _id: child._id,
                    containerId: _id,
                    isClicked: true,
                  })}
                >
                  <HighlightedTag
                    tagType={child.isSubChallenge ? "stage" : "tag"}
                    className={selectedTagId === child._id ? "selected-tag" : ""}
                    tagName={child.block.tagName}
                    text={child.isSubChallenge ? child.title : child.block.property.text}
                  />
                </TextTag>
              )}
            <BackwardDropArea
              _id={_id}
              onDrop={onDrop}
              onClick={onClick}
              index={index + 1}
              className={isDropAreaActive ? "drop-guide" : ""}
              needHighlight
            />
          </Draggable>
        ))}
      </>
      <TextTag onClick={isSubChallenge ? () => {} : handleTagClick}>
        <HighlightedTag
          tagType="container-close"
          tagName={tagName}
        />
      </TextTag>
    </div>
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
};

DropContainer.defaultProps = {
  selectedTagId: "",
  className: "",
};

const FirstDropArea = styled(DropArea)`
  margin: 4px 20px;
`;

const BackwardDropArea = styled(DropArea)`
  margin: 4px 0;
`;

const TextTag = styled.div`
  :before {
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

export { TextTag };
export default DropContainer;
