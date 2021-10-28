import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import OptionButton from "../OptionButton";

function StageList({
  _id, title, childTrees, onClick, isCompleted, stageId,
}) {
  const handleClick = () => onClick(_id);

  return (
    <Li>
      <OptionButton
        onClick={handleClick}
        value={title}
        isCompleted={isCompleted}
        className={stageId === _id ? "selected-stage" : ""}
      />
      <ol>
        {childTrees.map((child) => (child.isSubChallenge
          && (
          <StageList
            key={child._id}
            _id={child._id}
            title={child.title}
            childTrees={child.childTrees}
            onClick={onClick}
            isCompleted={child.isCompleted}
            stageId={stageId}
          />
          )
        ))}
      </ol>
    </Li>
  );
}

const menuSchema = {
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isCompleted: PropTypes.bool,
};

StageList.propTypes = {
  ...menuSchema,
  childTrees: PropTypes.arrayOf(
    PropTypes.shape(menuSchema),
  ).isRequired,
  onClick: PropTypes.func.isRequired,
  stageId: PropTypes.string.isRequired,
};

const Li = styled.li`
  margin: 5px 0px 5px 15px;

  .selected-stage {
    background-color: ${({ theme }) => theme.color.point};
  }
`;

export default StageList;
