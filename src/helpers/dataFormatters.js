import { NUMBER } from "../constants";

function convertCamelToKebab(string) {
  return [...string]
    .map((char, index) => (
      char === char.toUpperCase() && char.toLowerCase() !== char.toUpperCase() && index !== 0
        ? `-${char.toLowerCase()}`
        : char))
    .join("");
}

function calcPosition(prevPosition, newPosition) {
  const { top, left } = prevPosition;
  const { bottom, right, height } = newPosition;

  const result = { top, left };
  const isXOverflowed = left + right > (window.innerWidth * NUMBER.PREVIEW_X_RANGE);
  const isYOverflowed = top + bottom > window.innerHeight;

  if (isXOverflowed) {
    result.left -= left + right - (window.innerWidth * NUMBER.PREVIEW_X_RANGE);
  }

  if (isYOverflowed) {
    result.top = -height;
  }

  return result;
}

export {
  convertCamelToKebab,
  calcPosition,
};
