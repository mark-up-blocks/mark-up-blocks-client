import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import ElementBlock from "./ElementBlock";

function Display({ boilerplate, answer, isDone }) {
  const pages = isDone
    ? [{ ...boilerplate, key: "boilerplate" }]
    : [{ ...boilerplate, key: "boilerplate" }, { ...answer, key: "answer" }];

  return (
    <Container hasSingleChild={isDone}>
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
  answer: PropTypes.shape(ElementBlock.propTypes).isRequired,
  isDone: PropTypes.bool.isRequired,
};

export default Display;

const Container = styled.div`
  display: grid;
  grid-template-columns: ${({ hasSingleChild }) => (hasSingleChild ? "1fr" : "1fr 1fr")};
  margin: ${({ hasSingleChild }) => (hasSingleChild ? "0 auto" : "0")};
`;

const PageWrapper = styled.div`
  display: flex;
  margin: 10px;
  justify-content: center;
  align-items: center;
  border: ${({ theme }) => theme.border.page};
`;
