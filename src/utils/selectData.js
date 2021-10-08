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

  if (left.childTrees.length !== right.childTrees.length) {
    return false;
  }

  return left.childTrees.every(
    (child, index) => compareChildTreeIds(child, right.childTrees[index]),
  );
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

function findChallengeById(root, challengeId) {
  const queue = [root];

  while (queue.length) {
    const currentNode = queue.shift();

    if (currentNode) {
      if (currentNode._id === challengeId) {
        return currentNode;
      }

      if (currentNode.childChallenges) {
        queue.push(...currentNode.childChallenges);
      }
    }
  }

  return null;
}

function findNextUncompletedChallenge(root, id) {
  const queue = [root];

  while (queue.length) {
    const currentNode = queue.shift();

    if (currentNode) {
      if (currentNode._id !== id && (!currentNode?.data || !currentNode?.data.isCompleted)) {
        return currentNode._id;
      }

      if (currentNode.childChallenges) {
        queue.push(...currentNode.childChallenges);
      }
    }
  }

  return null;
}

export {
  findBlockTree,
  findBlockTreeById,
  findTagBlockById,
  compareChildTreeIds,
  compareChildTreeByBlockIds,
  findChallengeById,
  findNextUncompletedChallenge,
};
