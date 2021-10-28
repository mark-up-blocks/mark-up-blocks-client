function getTagType(isSubChallenge, isContainer) {
  if (isSubChallenge) {
    return "stage";
  }

  if (isContainer) {
    return "container";
  }

  return "tag";
}

function generateBlocks(elementTree, onlySubChallenge = true) {
  const queue = [...elementTree.childTrees];
  const blocks = [];

  while (queue.length) {
    const currentNode = queue.shift();
    const condition = onlySubChallenge ? !currentNode.isSubChallenge : true;
    const tagType = getTagType(currentNode.isSubChallenge, currentNode.block.isContainer);

    if (condition && currentNode.block.isContainer) {
      blocks.push({
        ...currentNode,
        tagType,
        childTrees: [],
      });
      queue.push(...currentNode.childTrees);
    } else {
      blocks.push({
        tagType,
        ...currentNode,
      });
    }
  }

  return blocks;
}

export {
  generateBlocks,
};
