function generateBlocks(elementTree, isRecursive = false) {
  const queue = [...elementTree.childTrees];
  const blocks = [];

  while (queue.length) {
    const currentNode = queue.shift();

    if (currentNode.isSubChallenge) {
      blocks.push(currentNode);
    } else {
      blocks.push({
        ...currentNode,
        childTrees: [],
      });

      if (isRecursive && currentNode.childTrees) {
        queue.push(...currentNode.childTrees);
      }
    }
  }

  return blocks;
}

export {
  generateBlocks,
};
