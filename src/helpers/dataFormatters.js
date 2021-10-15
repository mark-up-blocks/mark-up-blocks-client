import { NUMBER } from "../constants";

function convertCamelToKebab(string) {
  return [...string]
    .map((char, index) => (
      char === char.toUpperCase() && char.toLowerCase() !== char.toUpperCase() && index !== 0
        ? `-${char.toLowerCase()}`
        : char))
    .join("");
}

function calcPosition(tagBlockPosition, previewPosition) {
  const { top, left } = tagBlockPosition;
  const result = { top, left };
  const { width, height } = previewPosition;
  const overflowX = left + width - (window.innerWidth * NUMBER.PREVIEW_X_RANGE);

  if (overflowX > 0) {
    result.left -= overflowX;
  }

  result.top = -height;

  return result;
}

function formatTagName(isContainer, tagName, text) {
  return isContainer
    ? `<${tagName} />`
    : `<${tagName}>${text}</${tagName}>`;
}

export {
  convertCamelToKebab,
  calcPosition,
  formatTagName,
};
