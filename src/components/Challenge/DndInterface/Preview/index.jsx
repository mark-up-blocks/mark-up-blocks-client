import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import styled from "styled-components";

import ElementBlock from "../../Display/ElementBlock";

import { selectBlockTreeById } from "../../../../helpers/globalSelectors";
import { convertCamelToKebab, calcPosition } from "../../../../helpers/dataFormatters";

function Preview({
  _id, containerId, position, onClick,
}) {
  const blockTree = useSelector(
    (state) => selectBlockTreeById(state, containerId, _id),
  );
  const { block, tagType, childTrees } = blockTree;
  const styles = Object.entries(block?.property?.style || {})
    .map(([key, value]) => [convertCamelToKebab(key), value])
    .sort((a, b) => b[0] > a[0]);
  const previewChildTrees = tagType === "container" && !childTrees.length
    ? [{ _id: "virtualChild", block: { tagName: "span", property: { text: "child" }, isContainer: false } }]
    : childTrees;
  const { top, left } = calcPosition(position, { width: 300, height: 150 });
  const refURL = block.tagName === "svg"
    ? `${process.env.REACT_APP_REF_URI_SVG}/${block.tagName}`
    : `${process.env.REACT_APP_REF_URI}/${block.tagName}`;

  return (
    <PreviewWrapper top={top} left={left} onClick={onClick}>
      <PreviewElement>
        <ElementBlock
          _id="preview"
          block={block}
          childTrees={previewChildTrees}
        />
      </PreviewElement>
      <PreviewStyleProperty>
        <a href={refURL}>{block.tagName}</a>
        {styles.map(([key, value]) => (
          <PreviewStylePair key={key}>{`${key}: ${value};`}</PreviewStylePair>
        ))}
      </PreviewStyleProperty>
    </PreviewWrapper>
  );
}

Preview.propTypes = {
  _id: PropTypes.string.isRequired,
  containerId: PropTypes.string.isRequired,
  position: PropTypes.shape({
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

const PreviewWrapper = styled.div`
  display: grid;
  position: absolute;
  overflow: auto;
  width: 300px;
  height: 150px;
  top: ${({ top }) => `${top - 25}px`};
  left: ${({ left }) => `${left}px`};
  padding: 10px;
  background-color: ${({ theme }) => theme.color.preview};
  justify-content: start;
`;

const PreviewElement = styled.div`
  position: relative;
  display: flex;
  margin: auto;
  padding: 10px;
  background-color: white;
  justify-content: center;
  align-items: center;
`;

const PreviewStyleProperty = styled.div`
  width: 100%;
  max-height: 30px;
  margin: 5px;
  padding: 5px;
  color: white;
`;

const PreviewStylePair = styled.p`
  padding: 2px;
`;

export default Preview;
