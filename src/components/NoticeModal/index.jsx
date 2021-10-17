import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import styled from "styled-components";

import Modal from "../shared/Modal";

import { MESSAGE, TYPE } from "../../constants";

function NoticeModal({ onFinish, onReset }) {
  const { status, message, stageId } = useSelector((state) => state.notice);

  return (
    <Wrapper>
      <div>
        {status === TYPE.ERROR && (
        <>
          <p className="error">{MESSAGE.ERROR}</p>
          <p className="message">{message}</p>
          <ClickInterface onClick={onReset}>
            <div className="backward arrow" />
            <p className="text">{MESSAGE.GO_HOME}</p>
          </ClickInterface>
        </>
        )}
        {status === TYPE.LOADING && (
        <>
          <p className="emphasis">{MESSAGE.LOADING}</p>
          <p className="message">{message}</p>
        </>
        )}
        {status === TYPE.FINISH && (
        <>
          <pre>{MESSAGE.SUCCESS}</pre>
          <ClickInterface onClick={() => onFinish(stageId)}>
            <div className="forward arrow" />
            <p className="text">{MESSAGE.NEXT_STAGE}</p>
          </ClickInterface>
        </>
        )}
        {status === TYPE.ALL_DONE && (
        <>
          <pre>{MESSAGE.SUCCESS}</pre>
          <p className="emphasis">{MESSAGE.ENDING}</p>
        </>
        )}
      </div>
    </Wrapper>
  );
}

NoticeModal.propTypes = {
  onFinish: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default NoticeModal;

const Wrapper = styled(Modal)`
  .error {
    color: ${({ theme }) => theme.color.error};
  }

  .emphasis {
    font-size: 1.2rem;
    padding: 10px;
  }

  .message {
    margin-top: 25px;
  }
`;

const ClickInterface = styled.div`
  margin-top: 10px;
  color: ${({ theme }) => theme.color.main};
  cursor: pointer;

  :hover {
    color: ${({ theme }) => theme.color.focus};
  }

  .arrow {
    width: 0;
    height: 0;
    margin: auto;
    padding: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-radius: ${({ theme }) => theme.border.radius.container};
  }

  .arrow.forward {
    border-left: 18px solid ${({ color }) => color};
  }

  .arrow.backward {
    border-right: 18px solid ${({ color }) => color};
  }

  .text {
    margin-top: 5px;
    font-size: 0.8rem;
  }
`;