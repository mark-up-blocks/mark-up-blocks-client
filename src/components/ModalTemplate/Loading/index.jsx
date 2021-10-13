import React from "react";
import styled from "styled-components";

import Modal from "../../shared/Modal";
import { MESSAGE } from "../../../constants";

function Loading() {
  return (
    <Modal>
      <Wrapper>{MESSAGE.LOADING}</Wrapper>
    </Modal>
  );
}

export default Loading;

const Wrapper = styled.div`
  font-size: 5rem;
`;
