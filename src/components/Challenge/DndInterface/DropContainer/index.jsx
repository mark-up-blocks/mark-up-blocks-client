import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import styled from "styled-components";

import Draggable from "../Draggable";
import DropArea from "../DropArea";
import HighlightedTag from "../HighlightedTag";

import { selectBlockTreeById } from "../../../../helpers/globalSelectors";
import { DRAGGABLE_TYPE } from "../../../../constants";

function DropContainer({
  _id, containerId, selectedTagId,
  onDrop, onClick, onBlockClick,
  isDropAreaActive,
}) {
  const blockTree = useSelector((state) => selectBlockTreeById(state, containerId, _id));
  const { block, childTrees } = blockTree;
  const handleTagClick = () => {
    onBlockClick({ _id, containerId, isClicked: true });
  };

  return (
    <div>
      <TextTag onClick={containerId ? () => {} : handleTagClick}>
        <HighlightedTag
          tagType="container-open"
          tagName={block.tagName}
        />
      </TextTag>
      <FirstDropArea
        _id={_id}
        onDrop={onDrop}
        index={0}
        onClick={onClick}
        highlightClassName={isDropAreaActive ? "drop-guide" : ""}
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
                  containerId={_id}
                  selectedTagId={selectedTagId}
                  onDrop={onDrop}
                  onClick={onClick}
                  onBlockClick={onBlockClick}
                  isDropAreaActive={isDropAreaActive}
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
              highlightClassName={isDropAreaActive ? "drop-guide" : ""}
              needHighlight
            />
          </Draggable>
        ))}
      </>
      <TextTag onClick={containerId ? () => {} : handleTagClick}>
        <HighlightedTag
          tagType="container-close"
          tagName={block.tagName}
        />
      </TextTag>
    </div>
  );
}

DropContainer.propTypes = {
  _id: PropTypes.string.isRequired,
  containerId: PropTypes.string.isRequired,
  selectedTagId: PropTypes.string,
  onBlockClick: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  isDropAreaActive: PropTypes.bool.isRequired,
};

DropContainer.defaultProps = {
  selectedTagId: "",
};

const FirstDropArea = styled(DropArea)`
  ${({ needHighlight }) => (needHighlight
    ? `position: relative;
    margin: -8px;
    padding: 12px 32px 12px 28px`
    : "padding: 4px 24px 4px 20px")};
`;

const BackwardDropArea = styled(DropArea)`
    ${({ needHighlight }) => (needHighlight
    ? `position: relative;
    margin: -8px;
    padding: 12px 12px 12px 8px`
    : "padding: 4px 4px 4px 0")}
`;

const TextTag = styled.div`
  :before {
    position: absolute;
    right: 100%;
    margin-right: -20px;
    margin-top: 3px;
    text-align: right;
    font-size: 0.8rem;
    counter-increment: line;
    content: counter(line);
    color: ${({ theme }) => theme.color.inactive};
  }
`;

export { TextTag };
export default DropContainer;
