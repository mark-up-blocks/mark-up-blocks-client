import React from "react";
import { useSelector } from "react-redux";
import { render, fireEvent } from "@testing-library/react";
import MockTheme from "../../helpers/test/mockTheme";
import Header from "./index";
import { mockChallengeList, flatChallenge } from "../../helpers/test/mockData";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

describe("Header Component", () => {
  describe("title", () => {
    beforeEach(async () => {
      useSelector.mockImplementation((selector) => selector({
        challenge: {
          challenges: mockChallengeList,
          selectedIndex: 0,
        },
      }));
    });
    afterEach(() => useSelector.mockClear());

    test("should render title", () => {
      const onTitleClick = jest.fn();
      const onChallengeClick = jest.fn();
      const onStageMenuClick = jest.fn();

      const { getByText } = render(
        <MockTheme>
          <Header
            onTitleClick={onTitleClick}
            onChallengeClick={onChallengeClick}
            onStageMenuClick={onStageMenuClick}
          />
        </MockTheme>,
      );

      expect(getByText("Mark Up Blocks")).toBeInTheDocument();

      fireEvent.click(getByText("Mark Up Blocks"));
      expect(onTitleClick).toBeCalledTimes(1);
    });
  });

  describe("challenge list", () => {
    beforeEach(async () => {
      useSelector.mockImplementation((selector) => selector({
        challenge: {
          challenges: mockChallengeList,
          selectedIndex: 0,
        },
      }));
    });
    afterEach(() => useSelector.mockClear());

    test("should open challenge list when clicked", () => {
      const onTitleClick = jest.fn();
      const onChallengeClick = jest.fn();
      const onStageMenuClick = jest.fn();

      const { getByRole, container } = render(
        <MockTheme>
          <Header
            onTitleClick={onTitleClick}
            onChallengeClick={onChallengeClick}
            onStageMenuClick={onStageMenuClick}
          />
        </MockTheme>,
      );

      expect(getByRole("button", { name: "flat" })).toBeInTheDocument();
      expect(container.querySelector("nav").children.length).toBe(2);

      fireEvent.click(getByRole("button", { name: "flat" }));
      expect(container.querySelector("nav").children.length).toBe(3);

      const challengeList = container.querySelector("nav").children[0].children;
      const [flat, nested, deeplyNested] = [...challengeList];

      expect(flat.classList.contains("selected")).toBeTruthy();
      expect(flat.textContent).toBe("flat");
      expect(nested.textContent).toBe("nested");
      expect(deeplyNested.textContent).toBe("deeply nested");
    });

    test("should call onChallengeClick when clicked", () => {
      const onTitleClick = jest.fn();
      const onChallengeClick = jest.fn();
      const onStageMenuClick = jest.fn();

      const { getByRole } = render(
        <MockTheme>
          <Header
            onTitleClick={onTitleClick}
            onChallengeClick={onChallengeClick}
            onStageMenuClick={onStageMenuClick}
          />
        </MockTheme>,
      );

      fireEvent.click(getByRole("button", { name: "flat" }));

      expect(getByRole("button", { name: "nested" })).toBeInTheDocument();

      fireEvent.click(getByRole("button", { name: "nested" }));

      expect(onChallengeClick).toBeCalledTimes(1);
      expect(onChallengeClick).toBeCalledWith(1);
    });

    test("should close challenge list after challenge clicked", () => {
      const onTitleClick = jest.fn();
      const onChallengeClick = jest.fn();
      const onStageMenuClick = jest.fn();

      const { getByRole, container } = render(
        <MockTheme>
          <Header
            onTitleClick={onTitleClick}
            onChallengeClick={onChallengeClick}
            onStageMenuClick={onStageMenuClick}
          />
        </MockTheme>,
      );

      expect(container.querySelector("nav").children.length).toBe(2);

      fireEvent.click(getByRole("button", { name: "flat" }));
      expect(container.querySelector("nav").children.length).toBe(3);

      expect(getByRole("button", { name: "nested" })).toBeInTheDocument();

      fireEvent.click(getByRole("button", { name: "nested" }));
      expect(container.querySelector("nav").children.length).toBe(2);

      expect(onChallengeClick).toBeCalledTimes(1);
      expect(onChallengeClick).toBeCalledWith(1);
    });
  });

  describe("stage menu", () => {
    beforeEach(async () => {
      useSelector.mockImplementation((selector) => selector({
        challenge: {
          challenges: [
            {
              ...flatChallenge,
              isLoaded: true,
              stageId: "elementTree0",
            },
          ],
          selectedIndex: 0,
        },
      }));
    });
    afterEach(() => useSelector.mockClear());

    test("should open stage list when clicked", () => {
      const onTitleClick = jest.fn();
      const onChallengeClick = jest.fn();
      const onStageMenuClick = jest.fn();

      const { getByRole, container } = render(
        <MockTheme>
          <Header
            onTitleClick={onTitleClick}
            onChallengeClick={onChallengeClick}
            onStageMenuClick={onStageMenuClick}
          />
        </MockTheme>,
      );

      expect(container.querySelector("nav").children.length).toBe(2);

      fireEvent.click(getByRole("button", { name: "layout" }));
      expect(container.querySelector("nav").children.length).toBe(3);
    });

    test("should close stage list when clicked", () => {
      const onTitleClick = jest.fn();
      const onChallengeClick = jest.fn();
      const onStageMenuClick = jest.fn();

      const { getByRole, container } = render(
        <MockTheme>
          <Header
            onTitleClick={onTitleClick}
            onChallengeClick={onChallengeClick}
            onStageMenuClick={onStageMenuClick}
          />
        </MockTheme>,
      );

      fireEvent.click(getByRole("button", { name: "layout" }));
      expect(container.querySelector("nav").children.length).toBe(3);

      expect(container.querySelector(".selected").textContent).toBe("layout");

      fireEvent.click(container.querySelector(".selected"));
      expect(container.querySelector("nav").children.length).toBe(2);

      expect(onStageMenuClick).toBeCalledTimes(1);
      expect(onStageMenuClick).toBeCalledWith("elementTree0");
    });
  });
});
