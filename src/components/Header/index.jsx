import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import StageMenu from "../StageMenu";

function Header() {
  const { title: stageTitle, stageInfo } = useSelector((state) => state.challenge);
  const [isStageMenuOpen, setIsStageMenuOpen] = useState(false);
  const stageData = useSelector((state) => state.challenge.stageInfo.rootChallenge.data);

  return (
    <HeaderWrapper>
      <Title>Mark Up Blocks</Title>
      <Nav>
        {isStageMenuOpen && (
        <MenuWrapper>
          <StageMenu
            _id={stageData._id}
            title={stageData.title}
            childChallenges={stageData.childChallenges}
          />
        </MenuWrapper>
        )}
        <ChallengeName>{stageInfo.rootChallenge.name}</ChallengeName>
        <Stage onClick={() => setIsStageMenuOpen((prev) => !prev)}>{stageTitle || "Stage"}</Stage>
      </Nav>
    </HeaderWrapper>
  );
}

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

const Stage = styled.button`
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
