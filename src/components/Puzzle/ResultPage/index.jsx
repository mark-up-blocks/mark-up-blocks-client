import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import ElementBlock from "../ElementBlock";

function ResultPage() {
  const boilerplate = useSelector((state) => state.challenge.boilerplate);

  return (
    <ResultPageWrapper>
      {boilerplate ? (
        <ElementBlock
          _id={boilerplate._id}
          block={boilerplate.block}
          childTrees={boilerplate.childTrees}
        />
      ) : <div>로딩 중입니다.</div>}
    </ResultPageWrapper>
  );
}

export default ResultPage;

const ResultPageWrapper = styled.div`
  display: flex;
  margin: 10px;
  justify-content: center;
  align-items: center;
  border: ${({ theme }) => theme.border.page};
`;
