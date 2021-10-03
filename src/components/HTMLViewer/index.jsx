import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import DropContainer from "../DropContainer";
import { compareChildTreeIds } from "../../utils/selectData";

const HTMLViewerWrapper = styled.div`
  display: grid;
  align-items: center;
  margin: 10px;
  border: ${({ theme }) => theme.border.page};
`;

function HTMLViewer() {
  const boilerplate = useSelector(
    (state) => state.challenge.boilerplate,
    compareChildTreeIds,
  );

  return (
    <HTMLViewerWrapper>
      {boilerplate
        ? <DropContainer _id={boilerplate._id} childTrees={boilerplate.childTrees} />
        : <div>로딩 중입니다.</div>}
    </HTMLViewerWrapper>
  );
}

export default HTMLViewer;
