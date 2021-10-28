import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

function HighlightedTag({ tagType, tagName, text }) {
  if (tagType === "container-open" || tagType === "container-close") {
    return (
      <Tag>
        <span>{tagType === "container-open" ? "<" : "</"}</span>
        <span className="container">{tagName}</span>
        <span>{">"}</span>
      </Tag>
    );
  }

  return (
    <Tag>
      <span>{"<"}</span>
      <span className={tagType}>{tagName}</span>
      {(tagType === "tag" && !text)
        ? <span>{" />"}</span>
        : (
          <>
            <span>{">"}</span>
            <span>{text}</span>
            <span>{"</"}</span>
            <span className={tagType}>{tagName}</span>
            <span>{">"}</span>
          </>
        )}
    </Tag>
  );
}

HighlightedTag.propTypes = {
  tagType: PropTypes.oneOf([
    "stage",
    "container",
    "container-open",
    "container-close",
    "tag",
  ]).isRequired,
  tagName: PropTypes.string.isRequired,
  text: PropTypes.string,
};

HighlightedTag.defaultProps = {
  text: "",
};

const Tag = styled.span`
  .stage {
    color: ${({ theme }) => theme.color.challengeTag};
  }

  .container {
    color: ${({ theme }) => theme.color.parentTag};
  }

  .tag {
    color: ${({ theme }) => theme.color.childTag};
  }
`;

export default HighlightedTag;
