import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Modal from "../../shared/Modal";
import { MESSAGE } from "../../../constants";

function FinishPopup({ onClick, isFinalChallenge }) {
  return (
    <Modal>
      <pre>{MESSAGE.SUCCESS}</pre>
      {isFinalChallenge
        ? <Ending>{MESSAGE.ENDING}</Ending>
        : (
          <NextStage onClick={onClick}>
            <div className="next-stage-arrow" />
            <p className="next-stage-text">{MESSAGE.NEXT_STAGE}</p>
          </NextStage>
        )}
    </Modal>
  );
}

FinishPopup.propTypes = {
  onClick: PropTypes.func.isRequired,
  isFinalChallenge: PropTypes.bool,
};

FinishPopup.defaultProps = {
  isFinalChallenge: false,
};

export default FinishPopup;

const Ending = styled.div`
  font-size: 1.2rem;
  padding: 10px;
`;

const NextStage = styled.div`
  margin-top: 5px;
  color: ${({ theme }) => theme.color.main};
  cursor: pointer;

  :hover {
    color: ${({ theme }) => theme.color.focus};
  }

  .next-stage-arrow {
    width: 0;
    height: 0;
    margin: auto;
    padding: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-left: 18px solid ${({ color }) => color};
    border-radius: ${({ theme }) => theme.border.radius.container};
  }

  .next-stage-text {
    font-size: 0.8rem;
  }
`;
