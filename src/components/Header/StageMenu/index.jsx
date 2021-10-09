import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Button from "../../shared/Button";

function StageMenu({
  _id, title, childChallenges, onClick,
}) {
  const handleClick = () => onClick(_id);

  return (
    <Li>
      <StageButton onClick={handleClick} value={title} />
      {childChallenges.length ? (
        <ol>
          {childChallenges.map((child) => (
            <StageMenu
              key={child._id}
              _id={child._id}
              title={child.title}
              childChallenges={child.childChallenges}
              onClick={onClick}
            />
          ))}
        </ol>
      ) : <></>}
    </Li>
  );
}

const menuSchema = {
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

StageMenu.propTypes = {
  ...menuSchema,
  childChallenges: PropTypes.arrayOf(
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
  text-align: left;

  :hover {
    background-color: ${({ theme }) => theme.color.main};
  }
`;
