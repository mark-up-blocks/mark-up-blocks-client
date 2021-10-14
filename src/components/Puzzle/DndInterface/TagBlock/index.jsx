import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import debounce from "lodash.debounce";
import styled from "styled-components";
import Draggable from "../Draggable";
import ElementBlock from "../../Display/ElementBlock";
import { convertCamelToKebab, calcPosition, formatTagName } from "../../../../helpers/dataFormatters";

import { DRAGGABLE_TYPE, NUMBER } from "../../../../constants";

function TagBlock({
  _id, isSubChallenge, block, containerId, childTrees,
}) {
  const observer = useRef(null);
  const previewRef = useRef(null);
  const { tagName, isContainer, property } = block;
  const content = formatTagName(isContainer, tagName, property.text);
  const [{ top, left }, setPosition] = useState({ top: 0, left: 0 });
  const styles = Object.entries(block?.property?.style || {})
    .map(([key, value]) => [convertCamelToKebab(key), value])
    .sort((a, b) => b[0] > a[0]);
  const previewChildTrees = block.isContainer
    ? [{ _id: "virtualChild", block: { tagName: "span", property: { text: "child" }, isContainer: false } }]
    : [];

  useEffect(() => {
    const handleResize = () => {
      if (!previewRef?.current) {
        return;
      }

      setPosition(calcPosition({ top, left }, previewRef.current.getBoundingClientRect()));
    };
    const debouncedHandleResize = debounce(handleResize, NUMBER.DEBOUNCE_DELAY);
    const target = document.querySelector("#root");

    observer.current = new ResizeObserver(debouncedHandleResize);
    observer.current.observe(target);

    return () => observer.current.unobserve(target);
  }, [top, left]);

  return (
    <TagBlockWrapper>
      <Draggable
        _id={_id}
        type={isContainer ? DRAGGABLE_TYPE.CONTAINER : DRAGGABLE_TYPE.TAG}
        containerId={containerId}
      >
        <span>{content}</span>
      </Draggable>
      <Preview ref={previewRef} top={top} left={left}>
        <div className="preview-element">
          <ElementBlock
            _id="preview"
            block={block}
            childTrees={isSubChallenge ? childTrees : previewChildTrees}
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

export const tagBlockSchema = {
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
};

TagBlock.propTypes = {
  ...tagBlockSchema,
  containerId: PropTypes.string.isRequired,
  childTrees: PropTypes.arrayOf(
    PropTypes.shape(tagBlockSchema),
  ),
};

TagBlock.defaultProps = {
  childTrees: [],
};

export default TagBlock;

const Preview = styled.div`
  display: grid;
  position: absolute;
  visibility: hidden;
  z-index: 1;
  opacity: 0;
  overflow: auto;
  max-height: 200px;
  width: 250px;
  top: ${({ top }) => (top ? `${top - 5}px` : "30px")};
  left: ${({ left }) => (left ? `${left}px` : "auto")};
  padding: 10px;
  background-color: darkgray;
  border: 1px solid ${({ theme }) => theme.color.main};
  border-radius: ${({ theme }) => theme.border.radius.container};
  justify-content: start;
  transition: all 0.25s;

  .preview-element {
    display: flex;
    margin: auto;
    padding: 10px;
    background-color: white;
    border-radius: ${({ theme }) => theme.border.radius.container};
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

const TagBlockWrapper = styled.div`
  position: relative;
  border-radius: 10px;
  border: 1px solid gray;
  margin: 10px;

  :hover {
    ${Preview} {
      opacity: 1;
      visibility: visible;
    }
  }
`;
