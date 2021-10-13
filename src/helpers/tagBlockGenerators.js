function generateBlocks(elementTree) {
  const queue = [...elementTree.childTrees];
  const blocks = [];

  while (queue.length) {
    const currentNode = queue.shift();

    if (!currentNode.isSubChallenge && currentNode.block.isContainer) {
      blocks.push({
        ...currentNode,
        childTrees: [],
      });
      queue.push(...currentNode.childTrees);
    } else {
      blocks.push(currentNode);
    }
  }

  return blocks;
}

export {
  generateBlocks,
};
