import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import ElementBlock from "../../Display/ElementBlock";
import { convertCamelToKebab, calcPosition } from "../../../../helpers/dataFormatters";

function Preview({
  tagType, block, childTrees, position, className, onClick,
}) {
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
    <PreviewWrapper className={className} top={top} left={left} onClick={onClick}>
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

export const tagBlockSchema = {
  tagType: PropTypes.oneOf(["stage", "container", "tag"]),
  block: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    tagName: PropTypes.string.isRequired,
    isContainer: PropTypes.bool.isRequired,
    property: PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.objectOf(PropTypes.string),
      ]).isRequired,
    ).isRequired,
  }).isRequired,
};

Preview.propTypes = {
  ...tagBlockSchema,
  childTrees: PropTypes.arrayOf(
    PropTypes.shape(tagBlockSchema),
  ),
  className: PropTypes.string,
  position: PropTypes.shape({
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

Preview.defaultProps = {
  childTrees: [],
  className: "",
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
