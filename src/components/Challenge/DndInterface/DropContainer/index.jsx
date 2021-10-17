import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Draggable from "../Draggable";
import Droppable from "../Droppable";
import { tagBlockSchema } from "../TagBlock";

import { DRAGGABLE_TYPE } from "../../../../constants";

function DropContainer({
  _id, tagName, childTrees, onDrop, className, droppableClassName, droppableHoveredClassName,
}) {
  function getTextValue(child) {
    return child.isSubChallenge
      ? `<${child.block.tagName} />`
      : `<${child.block.tagName}>${child.block.property.text}</${child.block.tagName}>`;
  }

  return (
    <DropContainerWrapper className={className}>
      <span key="open" className="tag-text parent-tag">{`<${tagName}>`}</span>
      <>
        <Droppable
          key={_id}
          _id={_id}
          index={0}
          onDrop={onDrop}
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
                    droppableClassName={droppableClassName}
                    droppableHoveredClassName={droppableHoveredClassName}
                  />
                )
                : <span className={`tag-text ${child.isCorrect ? "correct" : "wrong"}`}>{getTextValue(child)}</span>}
            </Draggable>
            <Droppable
              _id={_id}
              index={index + 1}
              onDrop={onDrop}
              className={`droppable ${droppableClassName}`}
              hoveredClassName={`droppable ${droppableHoveredClassName}`}
            >
              <div />
            </Droppable>
          </div>
        ))}
      </>
      <span key="close" className="tag-text parent-tag">{`</${tagName}>`}</span>
    </DropContainerWrapper>
  );
}

DropContainer.propTypes = {
  _id: PropTypes.string.isRequired,
  tagName: PropTypes.string.isRequired,
  childTrees: PropTypes.arrayOf(
    PropTypes.shape({
      ...tagBlockSchema,
      isCorrect: PropTypes.bool,
    }),
  ).isRequired,
  onDrop: PropTypes.func.isRequired,
  className: PropTypes.string,
  droppableClassName: PropTypes.string,
  droppableHoveredClassName: PropTypes.string,
};

DropContainer.defaultProps = {
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
`;
