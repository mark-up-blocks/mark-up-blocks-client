import React from "react";
import PropTypes from "prop-types";
import { useDrop } from "react-dnd";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import { addChildTree } from "../../features/challenge";

const DroppableWrapper = styled.div`
  display: grid;
  align-content: space-between;
  padding: 5px 0;
  background-color: #bbb5b359;
`;

function Droppable({ children, _id }) {
  const dispatch = useDispatch();
  const [, dropRef] = useDrop(() => ({
    accept: ["tag", "container"],
    drop: ({ itemId }, monitor) => {
      if (monitor.didDrop()) {
        return;
      }

      if (itemId === _id) {
        return;
      }

      dispatch(addChildTree({ itemId, containerId: _id }));
    },
  }), [_id]);

  return (
    <DroppableWrapper ref={dropRef}>
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
};

export default Droppable;
