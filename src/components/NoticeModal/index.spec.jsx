import React from "react";
import { useSelector } from "react-redux";
import { render, fireEvent } from "@testing-library/react";
import MockTheme from "../../helpers/test/mockTheme";
import NoticeModal from "./index";
import { MESSAGE } from "../../constants";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

describe("NoticeModal Component", () => {
  describe("error status", () => {
    beforeEach(async () => {
      useSelector.mockImplementation((selector) => selector({
        notice: {
          status: "error",
          needPreventRender: true,
          message: "error message",
        },
      }));
    });
    afterEach(() => useSelector.mockClear());

    test("should render error status", () => {
      const onFinish = jest.fn();
      const onReset = jest.fn();

      const { getByText } = render(
        <MockTheme>
          <NoticeModal
            onFinish={onFinish}
            onReset={onReset}
          />
        </MockTheme>,
      );

      expect(getByText("error message")).toBeInTheDocument();
      expect(getByText(MESSAGE.GO_HOME)).toBeInTheDocument();
    });

    test("should call onReset when clicked", () => {
      const onFinish = jest.fn();
      const onReset = jest.fn();

      const { getByText } = render(
        <MockTheme>
          <NoticeModal
            onFinish={onFinish}
            onReset={onReset}
          />
        </MockTheme>,
      );

      fireEvent.click(getByText(MESSAGE.GO_HOME));
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
    });
    afterEach(() => useSelector.mockClear());

    test("should not render reset button when needPreventClear is true", () => {
      const onFinish = jest.fn();
      const onReset = jest.fn();

      const { getByText, queryByText } = render(
        <MockTheme>
          <NoticeModal
            onFinish={onFinish}
            onReset={onReset}
          />
        </MockTheme>,
      );

      expect(getByText("error message")).toBeInTheDocument();
      expect(queryByText(MESSAGE.GO_HOME)).toBeNull();
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
    });
    afterEach(() => useSelector.mockClear());

    test("should render loading status", () => {
      const onFinish = jest.fn();
      const onReset = jest.fn();

      const { getByText, queryByText } = render(
        <MockTheme>
          <NoticeModal
            onFinish={onFinish}
            onReset={onReset}
          />
        </MockTheme>,
      );

      expect(getByText("loading message")).toBeInTheDocument();
      expect(queryByText(MESSAGE.GO_HOME)).toBeNull();
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
    });
    afterEach(() => useSelector.mockClear());

    test("should render finish status", () => {
      const onFinish = jest.fn();
      const onReset = jest.fn();

      const { container, getByText } = render(
        <MockTheme>
          <NoticeModal
            onFinish={onFinish}
            onReset={onReset}
          />
        </MockTheme>,
      );

      const success = container.querySelector(".success");

      expect(success).toBeInTheDocument();
      expect(getByText(MESSAGE.NEXT_STAGE)).toBeInTheDocument();
    });

    test("should call onFinish when clicked", () => {
      const onFinish = jest.fn();
      const onReset = jest.fn();

      const { getByText } = render(
        <MockTheme>
          <NoticeModal
            onFinish={onFinish}
            onReset={onReset}
          />
        </MockTheme>,
      );

      fireEvent.click(getByText(MESSAGE.NEXT_STAGE));
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
    });
    afterEach(() => useSelector.mockClear());

    test("should render allDone status", () => {
      const onFinish = jest.fn();
      const onReset = jest.fn();

      const { container, queryByText } = render(
        <MockTheme>
          <NoticeModal
            onFinish={onFinish}
            onReset={onReset}
          />
        </MockTheme>,
      );

      const success = container.querySelector(".success");

      expect(success).toBeInTheDocument();
      expect(queryByText(MESSAGE.NEXT_STAGE)).toBeNull();
    });
  });
});
