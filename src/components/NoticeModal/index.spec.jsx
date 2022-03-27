import React from "react";
import { useSelector } from "react-redux";
import {
  render, fireEvent, screen, cleanup,
} from "@testing-library/react";
import MockTheme from "../../../__mocks__/mockTheme";
import NoticeModal from "./index";
import { MESSAGE } from "../../constants";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

describe("NoticeModal Component", () => {
  const onFinish = jest.fn();
  const onReset = jest.fn();
  const onRestart = jest.fn();

  const setup = () => render(
    <MockTheme>
      <NoticeModal
        onFinish={onFinish}
        onReset={onReset}
        onRestart={onRestart}
      />
    </MockTheme>,
  );

  beforeEach(() => {
    onFinish.mockClear();
    onReset.mockClear();
    onRestart.mockClear();
  });

  afterEach(cleanup);

  describe("error status", () => {
    beforeEach(async () => {
      useSelector.mockImplementation((selector) => selector({
        notice: {
          status: "error",
          needPreventRender: true,
          message: "error message",
        },
      }));
      setup();
    });

    afterEach(() => useSelector.mockClear());

    test("should render error status", () => {
      expect(screen.getByText("error message")).toBeInTheDocument();
      expect(screen.getByText(MESSAGE.GO_HOME)).toBeInTheDocument();
    });

    test("should call onReset when clicked", () => {
      fireEvent.click(screen.getByText(MESSAGE.GO_HOME));
      expect(onReset).toBeCalledTimes(1);
    });
  });

  describe("error status with truthy needPreventClear", () => {
    beforeEach(async () => {
      useSelector.mockImplementation((selector) => selector({
        notice: {
          status: "error",
          needPreventRender: true,
          message: "error message",
          needPreventClear: true,
        },
      }));
      setup();
    });
    afterEach(() => useSelector.mockClear());

    test("should not render reset button when needPreventClear is true", () => {
      expect(screen.getByText("error message")).toBeInTheDocument();
      expect(screen.queryByText(MESSAGE.GO_HOME)).toBeNull();
    });
  });

  describe("loading status", () => {
    beforeEach(async () => {
      useSelector.mockImplementation((selector) => selector({
        notice: {
          status: "loading",
          needPreventRender: true,
          message: "loading message",
        },
      }));
      setup();
    });
    afterEach(() => useSelector.mockClear());

    test("should render loading status", () => {
      expect(screen.getByText("loading message")).toBeInTheDocument();
      expect(screen.queryByText(MESSAGE.GO_HOME)).toBeNull();
    });
  });

  describe("finish status", () => {
    beforeEach(async () => {
      useSelector.mockImplementation((selector) => selector({
        notice: {
          status: "finish",
          isFinalChallenge: false,
          needPreventRender: false,
          message: "",
        },
      }));
      setup();
    });
    afterEach(() => useSelector.mockClear());

    test("should render finish status", () => {
      const success = document.querySelector(".success");

      expect(success).toBeInTheDocument();
      expect(screen.getByText(MESSAGE.NEXT_STAGE)).toBeInTheDocument();
    });

    test("should call onFinish when clicked", () => {
      fireEvent.click(screen.getByText(MESSAGE.NEXT_STAGE));
      expect(onFinish).toBeCalledTimes(1);
    });
  });

  describe("allDone status", () => {
    beforeEach(async () => {
      useSelector.mockImplementation((selector) => selector({
        notice: {
          status: "allDone",
          needPreventRender: false,
          message: "",
        },
      }));
      setup();
    });
    afterEach(() => useSelector.mockClear());

    test("should render allDone status", () => {
      const success = document.querySelector(".success");

      expect(success).toBeInTheDocument();
      expect(screen.queryByText(MESSAGE.NEXT_STAGE)).toBeNull();
    });

    test("should call onRestart when clicked", () => {
      fireEvent.click(screen.getByText(MESSAGE.RESTART));
      expect(onRestart).toBeCalledTimes(1);
    });
  });
});
