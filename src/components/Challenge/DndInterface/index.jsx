import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import CustomDragLayer from "./CustomDragLayer";
import TagBlock from "./TagBlock";
import DropArea from "./DropArea";
import DropContainer from "./DropContainer";
import Preview from "./Preview";
import Button from "../../shared/Button";

import { resetStage, markStageAnswer } from "../../../features/challenge";
import { selectStage } from "../../../helpers/globalSelectors";
import { usePick } from "../../../hooks/usePick";
import { TYPE, DRAGGABLE_TYPE } from "../../../constants";

function DndInterface({ onDrop, className }) {
  const stage = useSelector(selectStage);
  const dispatch = useDispatch();
  const {
    picked, onPick, onUnpick, onReset,
  } = usePick();
  const handleClickDrop = ({ index, containerId }) => {
    if (!picked._id || !containerId) {
      return;
    }

    if (containerId === picked.containerId && containerId === TYPE.TAG_BLOCK_CONTAINER) {
      return;
    }

    onReset();
    onDrop({
      itemId: picked._id,
      prevContainerId: picked.containerId,
      index,
      containerId,
    });
  };
  const handleDrop = (data) => {
    onReset();
    onDrop(data);
  };

  const handleReset = () => {
    onReset();
    dispatch(resetStage(stage._id));
  };
  const handleMarkAnswer = () => {
    onReset();
    dispatch(markStageAnswer(stage._id));
  };

  return (
    <Wrapper>
      <DndInterfaceWrapper className={className}>
        <CustomDragLayer />
        <TagBlockShowcase>
          {picked.position && (
          <Preview
            _id={picked._id}
            containerId={picked.containerId}
            position={picked.position}
            onClick={onUnpick}
          />
          )}
          <TagBlockShowcaseDropArea
            _id={TYPE.TAG_BLOCK_CONTAINER}
            index={-1}
            onDrop={handleDrop}
            onClick={handleClickDrop}
          />
          <TagBlockContainer>
            {stage.tagBlockContainer.childTrees.map(({
              _id, block, title, tagType,
            }) => (
              <TagBlock
                key={_id}
                _id={_id}
                containerId={TYPE.TAG_BLOCK_CONTAINER}
                tagName={block.tagName}
                tagType={tagType}
                text={tagType === "stage" ? title : block.property.text || ""}
                className={picked._id === _id ? "selected-tag-block" : "swing"}
                type={block.isContainer ? DRAGGABLE_TYPE.CONTAINER : DRAGGABLE_TYPE.TAG}
                onMouseOver={(data) => onPick(data, "hover")}
                onMouseOut={onUnpick}
                onClick={(data) => onPick(data, "click")}
              />
            ))}
          </TagBlockContainer>
        </TagBlockShowcase>
        <HTMLViewer>
          <LineNumberSpace />
          <DropContainer
            _id={stage.boilerplate._id}
            containerId=""
            onDrop={handleDrop}
            onClick={handleClickDrop}
            onBlockClick={(data) => onPick(data, "click")}
            selectedTagId={picked._id}
            isDropAreaActive={!!picked._id}
          />
        </HTMLViewer>
      </DndInterfaceWrapper>
      <Controller>
        <ControlButton value="Reset" onClick={handleReset} />
        <ControlButton value="Answer" onClick={handleMarkAnswer} />
      </Controller>
    </Wrapper>
  );
}

DndInterface.propTypes = {
  onDrop: PropTypes.func.isRequired,
  className: PropTypes.string,
};

DndInterface.defaultProps = {
  className: "",
};

const Wrapper = styled.div`
  display: grid;
`;

const DndInterfaceWrapper = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: 1fr 1fr;

  @media screen and (max-width: ${({ theme }) => theme.screenSize.maxWidth.mobile}) {
    grid-template-columns: 1fr;
    grid-auto-flow: row;
  }

  .dragging .swing {
    animation: none;
    background-color: ${({ theme }) => theme.color.preview};
  }

  .selected-tag {
    color: ${({ theme }) => theme.color.point};
  }
`;

const TagBlockShowcase = styled.div`
  position: relative;
  display: flex;
  padding: 10px;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-left: none;
`;

const TagBlockShowcaseDropArea = styled(DropArea)`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const TagBlockContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  .selected-tag-block {
    position: relative;
    background-color: ${({ theme }) => theme.color.preview};
  }
`;

const HTMLViewer = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 30px auto;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-left: none;
  counter-reset: line;

  @media screen and (max-width: ${({ theme }) => theme.screenSize.maxWidth.mobile}) {
    border-top: none;
  }

  .dragging * {
    color: ${({ theme }) => theme.color.point};
  }
`;

const LineNumberSpace = styled.div`
  width: 28px;
  height: 100%;
  margin-right: 5px;
  background-color: ${({ theme }) => theme.color.main};
`;

const Controller = styled.div`
  position: fixed;
  top: 100%;
  left: 100%;
  margin-left: -100px;
  margin-top: -110px;

  @media screen and (max-width: ${({ theme }) => theme.screenSize.maxWidth.mobile}) {
    position: unset;
    margin: 0;
    margin-left: auto;
    min-height: 250px;
  }
`;

const ControlButton = styled(Button)`
  width: 80px;
  height: 40px;
  margin: 5px 10px;
  border-radius: 2px;
  background-color: ${({ theme }) => theme.color.inner};

  :hover {
    background-color: ${({ theme }) => theme.color.point};
  }

  @media screen and (max-width: ${({ theme }) => theme.screenSize.maxWidth.mobile}) {
    margin: 10px 5px;
  }
`;

export default DndInterface;
