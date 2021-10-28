function getTagType(isSubChallenge, isContainer) {
  if (isSubChallenge) {
    return "stage";
  }

  if (isContainer) {
    return "container";
  }

  return "tag";
}

function validateBlockTree(node) {
  if (typeof node !== "object" || node === null) {
    return false;
  }

  const { _id, isSubChallenge, block } = node;

  if (typeof _id !== "string" || !_id) {
    return false;
  }

  if (typeof isSubChallenge !== "boolean") {
    return false;
  }

  if (block === null || typeof block !== "object") {
    return null;
  }

  const {
    _id: blockId, tagName, isContainer, property,
  } = block;

  if (typeof blockId !== "string" || !blockId) {
    return false;
  }

  if (typeof tagName !== "string" || !tagName) {
    return false;
  }

  if (typeof isContainer !== "boolean") {
    return false;
  }

  if (typeof property !== "object" || property === null) {
    return false;
  }

  return true;
}

function generateBlocks(elementTree, onlySubChallenge = true) {
  const queue = [...elementTree.childTrees];
  const blocks = [];

  while (queue.length) {
    const currentNode = queue.shift();
    const condition = onlySubChallenge ? !currentNode.isSubChallenge : true;
    const tagType = getTagType(currentNode.isSubChallenge, currentNode.block.isContainer);

    if (!validateBlockTree(currentNode)) {
      if (process.env.NODE_ENV === "development") {
        console.error(`tag block type error ${JSON.stringify(currentNode, null, 2)}`);
      }
    } else if (condition && currentNode.block.isContainer) {
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
