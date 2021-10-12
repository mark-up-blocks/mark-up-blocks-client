import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import debounce from "lodash.debounce";
import styled from "styled-components";
import Draggable from "../Draggable";
import ElementBlock from "../../Display/ElementBlock";
import { convertCamelToKebab, calcPosition } from "../../../../helpers/dataFormatters";

import { DRAGGABLE_TYPE } from "../../../../constants";

function TagBlock({
  _id, isSubChallenge, block, containerId,
}) {
  const ref = useRef(null);
  const { tagName, isContainer, property } = block;
  const content = isContainer || isSubChallenge
    ? `<${tagName} />`
    : `<${tagName}>${property.text}</${tagName}>`;
  const [{ top, left }, setPosition] = useState({ top: 0, left: 0 });
  const styles = Object.entries(block?.property?.style || {})
    .map(([key, value]) => [convertCamelToKebab(key), value])
    .sort((a, b) => b[0] > a[0]);

  useEffect(() => {
    const handleGetPosition = debounce(() => setPosition(calcPosition(ref?.current)), 300);

    window.addEventListener("resize", handleGetPosition);

    if (ref?.current) {
      handleGetPosition();
    }

    return () => window.removeEventListener("resize", handleGetPosition);
  }, []);

  return (
    <TagBlockWrapper top={top} left={left}>
      <Draggable
        _id={_id}
        type={isContainer ? DRAGGABLE_TYPE.CONTAINER : DRAGGABLE_TYPE.TAG}
        containerId={containerId}
      >
        <span>{content}</span>
      </Draggable>
      <Preview ref={ref} className="preview">
        <div className="preview-element">
          <ElementBlock
            _id="preview"
            block={block}
            childTrees={[]}
          />
        </div>
        <div className="preview-style">
          {styles.map(([key, value]) => (
            <p key={key}>{`${key}: ${value};`}</p>
          ))}
        </div>
      </Preview>
    </TagBlockWrapper>
  );
}

TagBlock.propTypes = {
  _id: PropTypes.string.isRequired,
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
  containerId: PropTypes.string.isRequired,
};

export default TagBlock;

const TagBlockWrapper = styled.div`
  position: relative;
  border-radius: 10px;
  border: 1px solid gray;
  margin: 10px;

  .preview {
    position: absolute;
    opacity: 0;
    visibility: hidden;
    top: ${({ top }) => (top ? `${top - 5}px` : "30px")};
    left: ${({ left }) => (left ? `${left}px` : "auto")};
    transition: all 0.25s;
  }

  :hover {
    .preview {
      opacity: 1;
      z-index: 1;
      visibility: visible;
      top: ${({ top }) => (top ? `${top - 5}px` : "30px")};
      left: ${({ left }) => (left ? `${left}px` : "auto")};
    }
  }
`;

const Preview = styled.div`
  display: grid;
  width: 250px;
  max-height: 200px;
  overflow: auto;
  padding: 10px;
  color: white;
  background-color: darkgray;
  border: 1px solid ${({ theme }) => theme.color.main};
  border-radius: 4px;
  justify-content: start;

  .preview-element {
    display: flex;
    margin: auto;
    padding: 10px;
    background-color: white;
    border-radius: 4px;
    justify-content: center;
    align-items: center;
  }

  .preview-style {
    width: 100%;
    max-height: 30px;
    margin: 5px;
    padding: 5px;

    p {
      padding: 2px;
    }
  }
`;
