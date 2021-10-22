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
      }, index) => (
        <PageWrapper key={key} index={index}>
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
  justify-content: center;
  align-items: center;
  border-right: 1px solid ${({ theme }) => theme.color.border};
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
  background-color: ${({ theme }) => theme.color.inner};

  @media screen and (max-width: ${({ theme }) => theme.screenSize.maxWidth.mobile}), {
    max-height: 300px;
    overflow: auto;
    order: ${({ index }) => -index};
  }
`;
