import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

function HighlightedTag({
  tagType, tagName, text, className,
}) {
  if (tagType === "container-open" || tagType === "container-close") {
    return (
      <Tag>
        <span className={className}>{tagType === "container-open" ? "<" : "</"}</span>
        <span className="container">{tagName}</span>
        <span className={className}>{">"}</span>
      </Tag>
    );
  }

  return (
    <Tag>
      <span className={className}>{"<"}</span>
      <span className={tagType}>{tagName}</span>
      {(tagType === "tag" && !text)
        ? <span className={className}>{" />"}</span>
        : (
          <>
            <span className={className}>{">"}</span>
            <span>{text}</span>
            <span className={className}>{"</"}</span>
            <span className={tagType}>{tagName}</span>
            <span className={className}>{">"}</span>
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
  className: PropTypes.string,
};

HighlightedTag.defaultProps = {
  text: "",
  className: "",
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
