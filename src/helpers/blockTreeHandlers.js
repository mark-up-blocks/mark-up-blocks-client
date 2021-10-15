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

function findContainerByChildId(root, _id) {
  if (!_id) {
    return null;
  }

  return findBlockTree(root, (block) => block.childTrees.find(
    (childBlock) => childBlock._id === _id,
  ), _id);
}

function compareChildTreeByBlockIds(left, right) {
  if (left === null && right === null) {
    return true;
  }

  if (left === null || right === null) {
    return false;
  }

  if (!left?.block?._id || !right?.block?._id) {
    return false;
  }

  if (left.block?._id !== right.block?._id) {
    return false;
  }

  if (!left?.childTrees || !right?.childTrees) {
    return false;
  }

  if (left.childTrees.length !== right.childTrees.length) {
    return false;
  }

  return left.childTrees.every(
    (child, index) => compareChildTreeByBlockIds(child, right.childTrees[index]),
  );
}

function findNextUncompletedChallenge(root, id) {
  const queue = [root];

  while (queue.length) {
    const currentNode = queue.pop();

    if (currentNode) {
      if (currentNode._id !== id && currentNode.isSubChallenge && !currentNode.isCompleted) {
        return currentNode._id;
      }

      if (currentNode.childTrees) {
        const reversed = [...currentNode.childTrees].reverse();

        queue.push(...reversed);
      }
    }
  }

  return null;
}

function validatePosition({
  elementTree, container, index, itemId,
}) {
  const correctContainer = findContainerByChildId(elementTree, itemId);
  const isSameContainer = correctContainer._id === container._id;
  const isSameContainerTag = correctContainer.block._id === container.block._id;
  const correctContainerIndex = correctContainer.childTrees.findIndex(
    (child) => child._id === itemId,
  );

  if (!(isSameContainer || isSameContainerTag)) {
    return false;
  }

  return correctContainerIndex >= index;
}

export {
  findBlockTree,
  findBlockTreeById,
  findContainerByChildId,
  compareChildTreeByBlockIds,
  findNextUncompletedChallenge,
  validatePosition,
};
