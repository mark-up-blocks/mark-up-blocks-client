function generateBlocks(elementTree, onlySubChallenge = true) {
  const queue = [...elementTree.childTrees];
  const blocks = [];

  while (queue.length) {
    const currentNode = queue.shift();
    const condition = onlySubChallenge ? !currentNode.isSubChallenge : true;

    if (condition && currentNode.block.isContainer) {
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
