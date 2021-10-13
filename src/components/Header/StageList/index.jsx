import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import OptionButton from "../OptionButton";

function StageList({
  _id, title, childTrees, onClick, isCompleted, selectedTitle,
}) {
  const handleClick = () => onClick(_id);

  return (
    <Li>
      <OptionButton
        onClick={handleClick}
        value={title}
        isCompleted={isCompleted}
        className={selectedTitle === title ? "selected" : ""}
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
            selectedTitle={selectedTitle}
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
  selectedTitle: PropTypes.string.isRequired,
};

export default StageList;

const Li = styled.li`
  margin: 5px 0px 5px 15px;

  .selected {
    background-color: ${({ theme }) => theme.color.main};
  }
`;
