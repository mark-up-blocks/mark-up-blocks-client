import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import styled from "styled-components";

import StageList from "./StageList";
import Button from "../shared/Button";
import OptionButton from "./OptionButton";
import { selectChallenge, selectActiveChallenge } from "../../helpers/globalSelectors";

function Header({ onTitleClick, onChallengeClick, onStageMenuClick }) {
  const { elementTree } = useSelector(selectChallenge);
  const { title } = useSelector(selectActiveChallenge);
  const { challenges, selectedIndex } = useSelector((state) => state.challenge);

  const [isChallengeListOpen, setIsChallengeListOpen] = useState(false);
  const [isStageListOpen, setIsStageListOpen] = useState(false);

  const challengeName = challenges[selectedIndex].name;

  const handleStageMenuClick = (_id) => {
    setIsStageListOpen(false);
    onStageMenuClick(_id);
  };
  const handleChallengeClick = (index) => {
    setIsChallengeListOpen(false);
    onChallengeClick(index);
  };

  return (
    <HeaderWrapper>
      <Title onClick={onTitleClick}>Mark Up Blocks</Title>
      <Nav>
        {isChallengeListOpen && (
          <ChallengeListWrapper className="grow-down">
            {challenges.map((challenge, index) => (
              <OptionButton
                key={challenge._id}
                onClick={() => handleChallengeClick(index)}
                className={selectedIndex === index ? "selected" : ""}
                value={challenge.name}
              />
            ))}
          </ChallengeListWrapper>
        )}
        {isStageListOpen && (
        <MenuWrapper className="grow-down">
          {elementTree?.childTrees
          && (
          <StageList
            _id={elementTree._id}
            title={elementTree.title}
            childTrees={elementTree.childTrees}
            onClick={handleStageMenuClick}
            isCompleted={Boolean(elementTree.isCompleted)}
            selectedTitle={title}
          />
          )}
        </MenuWrapper>
        )}
        <OpenButton onClick={() => setIsChallengeListOpen((prev) => !prev)} value={challengeName} />
        <OpenButton onClick={() => setIsStageListOpen((prev) => !prev)} value={title} />
      </Nav>
    </HeaderWrapper>
  );
}

Header.propTypes = {
  onTitleClick: PropTypes.func.isRequired,
  onChallengeClick: PropTypes.func.isRequired,
  onStageMenuClick: PropTypes.func.isRequired,
};

export default Header;

const HeaderWrapper = styled.header`
  display: flex;
  position: relative;
  color: ${({ theme }) => theme.color.inner};
  background-color: ${({ theme }) => theme.color.main};
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  margin: 10px;
  font-size: 1.5rem;
  font-family: "Noto Sans Display", sans-serif;
  cursor: pointer;

  @media screen and (max-width: ${({ theme }) => theme.screenSize.maxWidth.mobile}), {
    font-size: 1.2rem;
  }
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const OpenButton = styled(Button)`
  width: 100px;
  margin: 10px;
  padding: 5px 10px;
  font-size: 1.15em;
  color: ${({ theme }) => theme.color.main};
  background-color: ${({ theme }) => theme.color.inner};
  border: none;
  border-radius: ${({ theme }) => theme.border.radius.container};
  cursor: pointer;
  overflow: hidden;

  &:hover {
    background-color: ${({ theme }) => theme.color.focus};
  }
`;

const ListWrapper = styled.ol`
  position: absolute;
  z-index: 1;
  top: 48px;
  min-width: 100px;
  padding: 5px;
  background-color: ${({ theme }) => theme.color.inner};
  border: 2px solid ${({ theme }) => theme.color.main};
  border-radius: ${({ theme }) => theme.border.radius.container};
  box-shadow: 2px 2px 3px gray;
`;

const MenuWrapper = styled(ListWrapper)`
  right: 10px;
`;

const ChallengeListWrapper = styled(ListWrapper)`
  right: 120px;

  .selected {
    background-color: ${({ theme }) => theme.color.main};
  }
`;
