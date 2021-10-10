import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Button from "./index";

function Arrow({ onClick }) {
  return (
    <Wrapper onClick={onClick} />
  );
}

Arrow.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default Arrow;

const Wrapper = styled(Button)`
  box-sizing: border-box;
  width: 0;
  height: 0;
  margin: 2px;
  padding: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 18px solid ${({ theme }) => theme.color.main};
  border-radius: 2px;

  :hover {
    border-left: 18px solid ${({ theme }) => theme.color.focus};
  }
`;