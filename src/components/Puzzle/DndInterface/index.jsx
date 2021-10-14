import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import TagBlock, { tagBlockSchema } from "./TagBlock";
import Droppable from "./Droppable";
import DropContainer from "./DropContainer";

import { TYPE } from "../../../constants";

function DndInterface({
  tagBlockContainer, boilerplate, onDrop, className,
}) {
  return (
    <DndInterfaceWrapper className={className}>
      <Droppable className="tag-block-container-droppable" _id={TYPE.TAG_BLOCK_CONTAINER} onDrop={onDrop}>
        <TagBlockContainer>
          {tagBlockContainer.childTrees.map(({
            _id, isSubChallenge, block, childTrees,
          }, index) => (
            <Droppable
              _id={TYPE.TAG_BLOCK_CONTAINER}
              key={_id}
              index={index}
              onDrop={onDrop}
            >
              <TagBlock
                _id={_id}
                block={block}
                isSubChallenge={isSubChallenge}
                containerId={TYPE.TAG_BLOCK_CONTAINER}
                childTrees={childTrees}
              />
            </Droppable>
          ))}
        </TagBlockContainer>
      </Droppable>
      <HTMLViewer>
        <DropContainer
          _id={boilerplate._id}
          childTrees={boilerplate.childTrees}
          tagName={boilerplate.block.tagName}
          onDrop={onDrop}
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
    grid-template-rows: 1fr 1fr;
  }

  .tag-block-container-droppable {
    display: flex;
    margin: 10px;
    justify-content: center;
    align-items: center;
    border: ${({ theme }) => theme.border.container};
    border-radius: ${({ theme }) => theme.border.radius.container};
  }
`;

const TagBlockContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const HTMLViewer = styled.div`
  display: grid;
  align-items: center;
  margin: 10px;
  border: ${({ theme }) => theme.border.container};
  border-radius: ${({ theme }) => theme.border.radius.container};
`;
