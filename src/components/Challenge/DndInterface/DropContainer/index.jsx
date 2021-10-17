import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Draggable from "../Draggable";
import Droppable from "../Droppable";
import { tagBlockSchema } from "../TagBlock";
import Button from "../../../shared/Button";

import { DRAGGABLE_TYPE } from "../../../../constants";

function DropContainer({
  _id, tagName, childTrees, containerId, selectedTagId,
  onDrop, onClick, onBlockClick,
  className, droppableClassName, droppableHoveredClassName,
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
      <>
        <Droppable
          key={_id}
          _id={_id}
          index={0}
          onDrop={onDrop}
          onClick={onClick}
          className={`droppable ${droppableClassName}`}
          hoveredClassName={`droppable ${droppableHoveredClassName}`}
        >
          <div />
        </Droppable>
        {childTrees.map((child, index) => (
          <div key={child._id}>
            <Draggable
              _id={child._id}
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
                    onClick={onClick}
                    droppableClassName={droppableClassName}
                    droppableHoveredClassName={droppableHoveredClassName}
                    onBlockClick={onBlockClick}
                    containerId={_id}
                    selectedTagId={selectedTagId}
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
            </Draggable>
            <Droppable
              _id={_id}
              index={index + 1}
              onDrop={onDrop}
              onClick={onClick}
              className={`droppable ${droppableClassName}`}
              hoveredClassName={`droppable ${droppableHoveredClassName}`}
            >
              <div />
            </Droppable>
          </div>
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
  onClick: PropTypes.func.isRequired,
  onBlockClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  droppableClassName: PropTypes.string,
  droppableHoveredClassName: PropTypes.string,
};

DropContainer.defaultProps = {
  selectedTagId: "",
  className: "",
  droppableClassName: "",
  droppableHoveredClassName: "",
};

export default DropContainer;

const DropContainerWrapper = styled.div`
  .droppable {
    margin-left: 20px;
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
