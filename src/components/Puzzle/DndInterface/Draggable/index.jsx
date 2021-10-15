import React from "react";
import PropTypes from "prop-types";
import { useDrag } from "react-dnd";
import styled from "styled-components";

import { DRAGGABLE_TYPE } from "../../../../constants";

function Draggable({
  children, _id, type, containerId,
}) {
  const [, dragRef] = useDrag(
    () => ({
      type,
      item: { itemId: _id, prevContainerId: containerId },
    }),
  );

  return (
    <DraggableWrapper ref={dragRef}>
      {children}
    </DraggableWrapper>
  );
}

Draggable.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  _id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(Object.values(DRAGGABLE_TYPE)).isRequired,
  containerId: PropTypes.string.isRequired,
};

export default Draggable;

const DraggableWrapper = styled.div`
  margin: 1px 20px;
  padding: 2px;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.border.radius.container}
`;
