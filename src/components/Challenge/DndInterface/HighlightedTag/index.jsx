import React from "react";
import PropTypes from "prop-types";

function HighlightedTag({
  tagName, text, isSubChallenge, isContainer, type,
}) {
  if (isSubChallenge && type === "open") {
    return (
      <>
        <span key="self-open">{"<"}</span>
        <span key="self-tagName" className="challenge-tag">{tagName}</span>
        <span key="self-close">{">"}</span>
      </>
    );
  }

  if (isSubChallenge && type === "close") {
    return (
      <>
        <span key="self-open">{"</"}</span>
        <span key="self-tagName" className="challenge-tag">{tagName}</span>
        <span key="self-close">{">"}</span>
      </>
    );
  }

  if (isContainer && type === "open") {
    return (
      <>
        <span key="open-open">{"<"}</span>
        <span key="open-tagName" className="parent-tag">{tagName}</span>
        <span key="open-close">{">"}</span>
      </>
    );
  }

  if (isContainer && type === "close") {
    return (
      <>
        <span key="close-open">{"</"}</span>
        <span key="close-tagName" className="parent-tag">{tagName}</span>
        <span key="close-close">{">"}</span>
      </>
    );
  }

  if (isSubChallenge && type === "self-closing") {
    return (
      <>
        <span key="self-open">{"<"}</span>
        <span key="self-tagName" className="challenge-tag">{tagName}</span>
        <span key="self-close">{" />"}</span>
      </>
    );
  }

  if (isSubChallenge) {
    return (
      <>
        <span key="open-open">{"<"}</span>
        <span key="open-tagName" className="challenge-tag">{tagName}</span>
        <span key="open-close">{">"}</span>
        <span key="text">stage</span>
        <span key="close-open">{"</"}</span>
        <span key="close-tagName" className="challenge-tag">{tagName}</span>
        <span key="close-close">{">"}</span>
      </>
    );
  }

  if (isContainer) {
    return (
      <>
        <span key="open-open">{"<"}</span>
        <span key="open-tagName" className="parent-tag">{tagName}</span>
        <span key="open-close">{">"}</span>
        <span key="close-open">{"</"}</span>
        <span key="close-tagName" className="parent-tag">{tagName}</span>
        <span key="close-close">{">"}</span>
      </>
    );
  }

  if (text) {
    return (
      <>
        <span key="open-open">{"<"}</span>
        <span key="open-tagName" className="child-tag">{tagName}</span>
        <span key="open-close">{">"}</span>
        <span key="text">{text}</span>
        <span key="close-open">{"</"}</span>
        <span key="close-tagName" className="child-tag">{tagName}</span>
        <span key="close-close">{">"}</span>
      </>
    );
  }

  return (
    <>
      <span key="self-open">{"<"}</span>
      <span key="self-tagName" className="child-tag">{tagName}</span>
      <span key="self-close">{" />"}</span>
    </>
  );
}

HighlightedTag.propTypes = {
  tagName: PropTypes.string.isRequired,
  text: PropTypes.string,
  isSubChallenge: PropTypes.bool.isRequired,
  isContainer: PropTypes.bool.isRequired,
  type: PropTypes.string,
};

HighlightedTag.defaultProps = {
  text: "",
  type: "",
};

export default HighlightedTag;
