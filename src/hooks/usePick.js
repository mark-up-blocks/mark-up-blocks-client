import { useState } from "react";
import { useSelector } from "react-redux";

import { selectBlockTreeById } from "../helpers/globalSelectors";

const initialPicked = {
  _id: "",
  containerId: "",
  enablePreview: false,
  position: null,
  isClicked: false,
};

function usePick() {
  const [picked, setPicked] = useState(initialPicked);
  const pickedBlockTree = useSelector(
    (state) => selectBlockTreeById(state, picked.containerId, picked._id),
  );
  const handleReset = () => setPicked(initialPicked);
  const handleUnpick = () => {
    if (picked.isClicked) {
      return;
    }

    handleReset();
  };

  const handlePick = (data, pickType) => {
    const { _id, containerId, position } = data;
    const updatedPicked = {
      _id,
      containerId,
      position,
      isClicked: pickType === "click",
    };
    const isSecondClick = updatedPicked.isClicked && picked.isClicked && (picked._id === _id);

    if (!_id) {
      return;
    }

    if (picked.isClicked && !updatedPicked.isClicked) {
      return;
    }

    if (isSecondClick) {
      handleReset();
      return;
    }

    setPicked(updatedPicked);
  };

  return {
    picked: pickedBlockTree
      ? { ...picked, ...pickedBlockTree, enablePreview: !!picked.position }
      : picked,
    onPick: handlePick,
    onUnpick: handleUnpick,
    onReset: handleReset,
  };
}

export { usePick };
