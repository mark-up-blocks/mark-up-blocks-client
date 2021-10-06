import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import { changeStage } from "../../features/challenge";

function StageMenu({ _id, title, childChallenges }) {
  const dispatch = useDispatch();
  const handleClick = () => dispatch(changeStage(_id));

  return (
    <Li>
      <StageButton type="button" onClick={handleClick}>
        {title}
      </StageButton>
      {childChallenges.length ? (
        <ol>
          {childChallenges.map((child) => (
            <StageMenu
              key={child._id}
              _id={child._id}
              title={child.title}
              childChallenges={child.childChallenges}
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
};

export default StageMenu;

const Li = styled.li`
  margin: 5px 0px 5px 15px;
`;

const StageButton = styled.button`
  width: 100%;
  padding: 5px;
  color: ${({ theme }) => theme.color.text};
  text-align: left;

  :hover {
    background-color: ${({ theme }) => theme.color.main};
  }
`;
