import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import TagBlock from "./TagBlock";
import Droppable from "./Droppable";
import DropContainer from "./DropContainer";

function DndInterface({
  tagBlockContainer, boilerplate, onDrop, className,
}) {
  const handleDrop = ({ itemId, containerId, index }) => {
    onDrop({ itemId, containerId, index });
  };

  return (
    <DndInterfaceWrapper className={className}>
      <TagBlockContainer _id="tagBlockContainer" onDrop={onDrop}>
        {tagBlockContainer.childTrees.map(({ _id, isChallenge, block }) => (
          <TagBlock
            key={_id}
            _id={_id}
            block={block}
            isChallenge={isChallenge}
          />
        ))}
      </TagBlockContainer>
      <HTMLViewer>
        <DropContainer
          _id={boilerplate._id}
          childTrees={boilerplate.childTrees}
          tagName={boilerplate.block.tagName}
          onDrop={handleDrop}
        />
      </HTMLViewer>
    </DndInterfaceWrapper>
  );
}

DndInterface.propTypes = {
  tagBlockContainer: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    tagName: PropTypes.string.isRequired,
    childTrees: PropTypes.arrayOf(
      PropTypes.shape(TagBlock.propTypes),
    ).isRequired,
  }).isRequired,
  boilerplate: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    childTrees: PropTypes.arrayOf(
      PropTypes.shape(TagBlock.propTypes),
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
