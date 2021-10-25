import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import ElementBlock from "../../Display/ElementBlock";
import { convertCamelToKebab, calcPosition } from "../../../../helpers/dataFormatters";

function Preview({
  isSubChallenge, block, childTrees, position, className, onClick,
}) {
  const styles = Object.entries(block?.property?.style || {})
    .map(([key, value]) => [convertCamelToKebab(key), value])
    .sort((a, b) => b[0] > a[0]);
  const previewChildTrees = !isSubChallenge && block.isContainer && childTrees.length
    ? [{ _id: "virtualChild", block: { tagName: "span", property: { text: "child" }, isContainer: false } }]
    : childTrees;
  const { top, left } = calcPosition(position, { width: 300, height: 150 });

  return (
    <PreviewWrapper className={className} top={top} left={left} onClick={onClick}>
      <div className="preview-element">
        <ElementBlock
          _id="preview"
          block={block}
          childTrees={previewChildTrees}
        />
      </div>
      <div className="preview-style">
        {styles.map(([key, value]) => (
          <p key={key}>{`${key}: ${value};`}</p>
        ))}
      </div>
    </PreviewWrapper>
  );
}

export const tagBlockSchema = {
  isSubChallenge: PropTypes.bool.isRequired,
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

export default Preview;

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

  .preview-element {
    display: flex;
    margin: auto;
    padding: 10px;
    background-color: white;
    justify-content: center;
    align-items: center;
  }

  .preview-style {
    width: 100%;
    max-height: 30px;
    margin: 5px;
    padding: 5px;
    color: white;

    p {
      padding: 2px;
    }
  }
`;
