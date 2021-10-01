import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import ElementBlock from "../ElementBlock";

const TargetPageWrapper = styled.div`
  display: flex;
  margin: 10px;
  justify-content: center;
  align-items: center;
  border: ${({ theme }) => theme.border.page};
`;

function TargetPage() {
  const { answer } = useSelector((state) => state.challenge);

  return (
    <TargetPageWrapper>
      {answer ? (
        <ElementBlock
          _id={answer._id}
          block={answer.block}
          childTrees={answer.childTrees}
        />
      ) : <div>로딩 중입니다.</div>}
    </TargetPageWrapper>
  );
}

export default TargetPage;
