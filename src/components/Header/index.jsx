import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import styled from "styled-components";

import StageList from "./StageList";
import Button from "../shared/Button";
import OptionButton from "./OptionButton";
import { selectStageByParams } from "../../helpers/globalSelectors";

function Header({ onTitleClick, onChallengeClick, onStageMenuClick }) {
  const { challenges, selectedIndex } = useSelector((state) => state.challenge);
  const { name: challengeName, elementTree, stageId } = challenges[selectedIndex];
  const { title: stageTitle } = useSelector(
    (state) => selectStageByParams(state, { index: selectedIndex, id: stageId }),
  );

  const [isChallengeListOpen, setIsChallengeListOpen] = useState(false);
  const [isStageListOpen, setIsStageListOpen] = useState(false);

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
                className={selectedIndex === index ? "selected-challenge" : ""}
                value={challenge.name}
                isCompleted={Boolean(challenge.isCompleted)}
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
            stageId={stageId}
          />
          )}
        </MenuWrapper>
        )}
        <OpenButton onClick={() => setIsChallengeListOpen((prev) => !prev)} value={challengeName} />
        <OpenButton onClick={() => setIsStageListOpen((prev) => !prev)} value={stageTitle} />
      </Nav>
    </HeaderWrapper>
  );
}

Header.propTypes = {
  onTitleClick: PropTypes.func.isRequired,
  onChallengeClick: PropTypes.func.isRequired,
  onStageMenuClick: PropTypes.func.isRequired,
};

const HeaderWrapper = styled.header`
  display: flex;
  position: relative;
  background-color: ${({ theme }) => theme.color.sub};
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  margin: 10px;
  font-size: 1.2rem;
  cursor: pointer;

  @media screen and (max-width: ${({ theme }) => theme.screenSize.maxWidth.mobile}), {
    font-size: 1rem;
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
  padding: 10px;
  font-size: 0.9em;
  color: ${({ theme }) => theme.color.inner};
  border-bottom: 5px solid transparent;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    border-bottom: 5px solid ${({ theme }) => theme.color.point};
  }
`;

const ListWrapper = styled.ol`
  position: absolute;
  z-index: 1;
  top: 48px;
  min-width: 100px;
  padding: 5px;
  background-color: ${({ theme }) => theme.color.sub};
  box-shadow: 2px 2px 1px ${({ theme }) => theme.color.sub};
`;

const MenuWrapper = styled(ListWrapper)`
  right: 1px;
`;

const ChallengeListWrapper = styled(ListWrapper)`
  right: 120px;

  .selected-challenge {
    background-color: ${({ theme }) => theme.color.point};
  }
`;

export default Header;
