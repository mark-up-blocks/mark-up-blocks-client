import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Button from "../../shared/Button";

function StageMenu({
  _id, title, childTrees, onClick, isCompleted,
}) {
  const handleClick = () => onClick(_id);

  return (
    <Li>
      <StageButton onClick={handleClick} value={title} isCompleted={isCompleted} />
      <ol>
        {childTrees.map((child) => (child.isSubChallenge
          && (
          <StageMenu
            key={child._id}
            _id={child._id}
            title={child.title}
            childTrees={child.childTrees}
            onClick={onClick}
            isCompleted={child.isCompleted}
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

StageMenu.propTypes = {
  ...menuSchema,
  childTrees: PropTypes.arrayOf(
    PropTypes.shape(menuSchema),
  ).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default StageMenu;

const Li = styled.li`
  margin: 5px 0px 5px 15px;
`;

const StageButton = styled(Button)`
  width: 100%;
  padding: 5px;
  color: ${({ theme }) => theme.color.text};
  background-color: ${({ isCompleted }) => (isCompleted ? "lightgray" : "transparent")};
  text-align: left;

  :hover {
    background-color: ${({ theme }) => theme.color.main};
  }
`;
