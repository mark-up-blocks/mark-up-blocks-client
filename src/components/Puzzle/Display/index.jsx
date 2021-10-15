import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import ElementBlock from "./ElementBlock";
import { TYPE } from "../../../constants";

function Display({ boilerplate, elementTree }) {
  const pages = [
    { ...boilerplate, key: TYPE.BOILERPLATE },
    { ...elementTree, key: TYPE.ELEMENT_TREE },
  ];

  return (
    <Container>
      {pages.map(({
        _id, key, block, childTrees,
      }) => (
        <PageWrapper key={key}>
          <ElementBlock
            _id={_id}
            block={block}
            childTrees={childTrees}
          />
        </PageWrapper>
      ))}
    </Container>
  );
}

Display.propTypes = {
  boilerplate: PropTypes.shape(ElementBlock.propTypes).isRequired,
  elementTree: PropTypes.shape(ElementBlock.propTypes).isRequired,
};

export default Display;

const Container = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: 1fr 1fr;

  @media screen and (max-width: ${({ theme }) => theme.screenSize.maxWidth.mobile}), {
    grid-template-columns: auto;
    grid-template-rows: 1fr 1fr;
  }
`;

const PageWrapper = styled.div`
  display: flex;
  overflow: auto;
  margin: 10px;
  justify-content: center;
  align-items: center;
  border: ${({ theme }) => theme.border.container};
  border-radius: ${({ theme }) => theme.border.radius.container};

  @media screen and (max-width: ${({ theme }) => theme.screenSize.maxWidth.mobile}), {
    max-height: 300px;
    overflow: auto;
  }
`;
