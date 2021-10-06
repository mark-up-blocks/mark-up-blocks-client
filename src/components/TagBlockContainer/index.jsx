import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import TagBlock from "../TagBlock";

const ContainerWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 10px;
  justify-content: center;
  align-items: center;
  border: ${({ theme }) => theme.border.page};
`;

function TagBlockContainer() {
  const { tagBlocks } = useSelector((state) => state.challenge);

  return (
    <ContainerWrapper>
      {tagBlocks.map(({
        _id, block, hasUsed, isElementCluster,
      }) => (
        !hasUsed && (
        <TagBlock
          key={_id}
          _id={_id}
          block={block}
          isElementCluster={isElementCluster}
        />
        )
      ))}
    </ContainerWrapper>
  );
}

export default TagBlockContainer;
