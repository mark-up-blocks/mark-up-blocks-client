import { useState } from "react";

const initialPicked = {
  _id: "",
  containerId: "",
  enablePreview: false,
  position: null,
  isClicked: false,
};

function usePick() {
  const [picked, setPicked] = useState(initialPicked);
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
    picked,
    onPick: handlePick,
    onUnpick: handleUnpick,
    onReset: handleReset,
  };
}

export { usePick };
