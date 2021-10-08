function convertCamelToKebab(string) {
  return [...string]
    .map((char, index) => (
      char === char.toUpperCase() && char.toLowerCase() !== char.toUpperCase() && index !== 0
        ? `-${char.toLowerCase()}`
        : char))
    .join("");
}

function calcPosition(ref) {
  const result = {
    top: 0,
    left: 0,
  };

  if (!ref) {
    return result;
  }

  const {
    top, left, width, height,
  } = ref.getBoundingClientRect();

  if (left + width > (window.innerWidth / 2)) {
    result.left -= (left + width - (window.innerWidth / 2));
  }

  if (top + height > window.innerHeight) {
    result.top -= height;
  }

  return result;
}

export {
  convertCamelToKebab,
  calcPosition,
};
