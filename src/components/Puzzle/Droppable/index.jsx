import React from "react";
import PropTypes from "prop-types";
import { useDrop } from "react-dnd";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import { addChildTree } from "../../../features/challenge";

const DroppableWrapper = styled.div`
  display: grid;
  margin: 1px 0;
  padding: 2px 0;
  align-content: space-between;
  background-color: ${({ hovered }) => (hovered ? "salmon" : "transparent")};
`;

function Droppable({ children, _id, index }) {
  const dispatch = useDispatch();
  const [{ hovered }, dropRef] = useDrop(() => ({
    accept: ["tag", "container"],
    drop({ itemId }, monitor) {
      if (monitor.didDrop()) {
        return;
      }

      if (itemId === _id) {
        return;
      }

      dispatch(addChildTree({ itemId, containerId: _id, index }));
    },
    collect(monitor) {
      return { hovered: monitor.isOver({ shallow: true }) };
    },
  }), [_id, index]);

  return (
    <DroppableWrapper ref={dropRef} hovered={hovered}>
      {children}
    </DroppableWrapper>
  );
}

Droppable.propTypes = {
  _id: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  index: PropTypes.number,
};

Droppable.defaultProps = {
  index: -1,
};

export default Droppable;
