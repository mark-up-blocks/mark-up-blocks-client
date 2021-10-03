function findBlockTree(root, callback) {
  const queue = [root];

  while (queue.length) {
    const currentNode = queue.shift();

    if (currentNode) {
      if (callback(currentNode)) {
        return currentNode;
      }

      if (currentNode.childTrees) {
        queue.push(...currentNode.childTrees);
      }
    }
  }

  return null;
}

function findBlockTreeById(root, _id) {
  if (!_id) {
    return null;
  }

  return findBlockTree(root, (block) => block._id === _id);
}

function findTagBlockById(tagBlocks, _id) {
  return tagBlocks.find((tagBlock) => tagBlock._id === _id);
}

function compareChildTreeIds(left, right) {
  if (left === null && right === null) {
    return true;
  }

  if (left === null || right === null) {
    return false;
  }

  if (!left?._id || !right?._id) {
    return false;
  }

  if (left._id !== right._id) {
    return false;
  }

  if (!left?.childTrees || !right?.childTrees) {
    return false;
  }

  if (left.childTrees.length === 0 && right.childTrees.length === 0) {
    return true;
  }

  return left.childTrees.every(
    (child, index) => compareChildTreeIds(child, right.childTrees[index]),
  );
}

export {
  findBlockTree,
  findBlockTreeById,
  findTagBlockById,
  compareChildTreeIds,
};