import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Draggable from "../Draggable";
import DropArea from "../DropArea";
import { tagBlockSchema } from "../TagBlock";
import Button from "../../../shared/Button";

import { DRAGGABLE_TYPE } from "../../../../constants";

function DropContainer({
  _id, tagName, childTrees, containerId, selectedTagId,
  onDrop, onClick, onBlockClick,
  className, isDropAreaActive,
}) {
  function getTextValue(child) {
    return child.isSubChallenge
      ? `<${child.block.tagName} />`
      : `<${child.block.tagName}>${child.block.property.text || ""}</${child.block.tagName}>`;
  }

  const handleTagClick = () => {
    onBlockClick({ _id, containerId, isClicked: true });
  };

  return (
    <DropContainerWrapper className={className}>
      <div className="tag-text">
        <TagButton
          key="open"
          className={`parent-tag ${selectedTagId === _id ? "selected-tag" : ""}`}
          onClick={handleTagClick}
          value={`<${tagName}>`}
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
            content={getTextValue(child)}
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
                <div className="tag-text">
                  <TagButton
                    className={`${child.isCorrect ? "correct" : "wrong"} ${selectedTagId === child._id ? "selected-tag" : ""}`}
                    value={getTextValue(child)}
                    onClick={() => onBlockClick({
                      _id: child._id,
                      containerId: _id,
                      isClicked: true,
                    })}
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
      <div className="tag-text">
        <TagButton
          key="close"
          className={`parent-tag ${selectedTagId === _id ? "selected-tag" : ""}`}
          onClick={handleTagClick}
          value={`</${tagName}>`}
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
    margin: 3px 0px;
  }

  .first-drop-area {
    margin: 3px 20px;
  }

  .parent-tag {
    color: ${({ theme }) => theme.color.parentTag};
  }

  .selected-tag {
    color: ${({ theme }) => theme.color.point};
  }
`;

const TagButton = styled(Button)`
  position: relative;
`;

export default DropContainer;
