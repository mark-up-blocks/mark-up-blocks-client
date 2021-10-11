import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import styled from "styled-components";

import StageMenu from "./StageMenu";
import Button from "../shared/Button";

function Header({ onTitleClick, onMenuClick }) {
  const { challenges, selectedIndex } = useSelector((state) => state.challenge);
  const challenge = challenges[selectedIndex];
  const [isStageMenuOpen, setIsStageMenuOpen] = useState(false);

  return (
    <HeaderWrapper>
      <Title onClick={onTitleClick}>Mark Up Blocks</Title>
      <Nav>
        {isStageMenuOpen && (
        <MenuWrapper>
          {challenge.elementTree?.childTrees
          && (
          <StageMenu
            _id={challenge.elementTree._id}
            title={challenge.elementTree.title}
            childTrees={challenge.elementTree.childTrees}
            onClick={onMenuClick}
            isCompleted={Boolean(challenge.elementTree.isCompleted)}
          />
          )}
        </MenuWrapper>
        )}
        <ChallengeName>{challenge.name}</ChallengeName>
        <StageButton onClick={() => setIsStageMenuOpen((prev) => !prev)} value={challenge.name} />
      </Nav>
    </HeaderWrapper>
  );
}

Header.propTypes = {
  onTitleClick: PropTypes.func.isRequired,
  onMenuClick: PropTypes.func.isRequired,
};

export default Header;

const HeaderWrapper = styled.header`
  display: flex;
  position: relative;
  color: ${({ theme }) => theme.color.inner};
  background-color: ${({ theme }) => theme.color.main};
  justify-content: space-between;
  align-items: center;
  font-family: "Noto Sans Display", sans-serif;
`;

const Title = styled.h2`
  margin: 10px;
  font-size: 1.8rem;
  cursor: pointer;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ChallengeName = styled.h3`
  margin: 10px;
  font-size: 1.3rem;
`;

const StageButton = styled(Button)`
  width: 100px;
  margin: 10px;
  padding: 5px 10px;
  font-size: 1.15em;
  color: ${({ theme }) => theme.color.main};
  background-color: ${({ theme }) => theme.color.inner};
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.color.focus};
  }
`;

const MenuWrapper = styled.ol`
  position: absolute;
  top: 48px;
  right: 10px;
  min-width: 100px;
  padding: 5px;
  background-color: ${({ theme }) => theme.color.inner};
  border: 2px solid ${({ theme }) => theme.color.main};
  border-radius: 4px;
  box-shadow: 2px 2px 3px gray;
`;
