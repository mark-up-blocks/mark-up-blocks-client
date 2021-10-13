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
      <TagBlockContainer _id={TYPE.TAG_BLOCK_CONTAINER} onDrop={onDrop}>
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
  grid-template-columns: 1fr 1fr;
`;

const TagBlockContainer = styled(Droppable)`
  display: flex;
  flex-wrap: wrap;
  margin: 10px;
  justify-content: center;
  align-items: center;
  border: ${({ theme }) => theme.border.page};
`;

const HTMLViewer = styled.div`
  display: grid;
  align-items: center;
  margin: 10px;
  border: ${({ theme }) => theme.border.page};
`;
