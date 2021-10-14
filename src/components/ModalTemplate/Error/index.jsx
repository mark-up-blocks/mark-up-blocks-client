import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Modal from "../../shared/Modal";
import { MESSAGE } from "../../../constants";

function Error({ message }) {
  return (
    <Modal>
      <Wrapper>{message}</Wrapper>
    </Modal>
  );
}

Error.propTypes = {
  message: PropTypes.string,
};

Error.defaultProps = {
  message: MESSAGE.INTERNAL_SERVER_ERROR,
};

export default Error;

const Wrapper = styled.p`
  color: ${({ theme }) => theme.color.error};
`;
