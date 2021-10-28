import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

function Modal({ className, children, onClick }) {
  return (
    <Wrapper>
      <Background />
      <ModalWrapper
        className={className}
        onClick={onClick}
      >
        {children}
      </ModalWrapper>
    </Wrapper>
  );
}

Modal.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  onClick: PropTypes.func,
};

Modal.defaultProps = {
  className: "",
  onClick: () => {},
};

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const Background = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 10;
  opacity: 0.4;
  background-color: ${({ theme }) => theme.color.inactive};
`;

const ModalWrapper = styled.div`
  display: grid;
  z-index: 11;
  opacity: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
  text-align: center;
  background-color: ${({ theme }) => theme.color.inner};
`;

export default Modal;
