import React from "react";
import { render, fireEvent } from "@testing-library/react";
import StageList from "./index";
import MockTheme from "../../../../__mocks__/mockTheme";
import { flatChallenge, nestedChallenge, deeplyNestedChallenge } from "../../../../__mocks__/mockData";

describe("StageList Component", () => {
  test("should pass flat challenge", () => {
    const onClick = jest.fn();
    const { elementTree } = flatChallenge;
    const { container, getByText } = render(
      <MockTheme>
        <StageList
          _id={elementTree._id}
          title={elementTree.title}
          childTrees={elementTree.childTrees}
          onClick={onClick}
          isCompleted={false}
          stageId="elementTree0"
        />
      </MockTheme>,
    );

    expect(getByText("layout")).toBeInTheDocument();
    expect(container.querySelector(".selected-stage").textContent).toBe("layout");

    fireEvent.click(getByText("layout"));
    expect(onClick).toBeCalledTimes(1);
    expect(onClick).toBeCalledWith("elementTree0");
  });

  test("should pass nested challenge", () => {
    const onClick = jest.fn();
    const { elementTree } = nestedChallenge;
    const { container, getByText, queryByText } = render(
      <MockTheme>
        <StageList
          _id={elementTree._id}
          title={elementTree.title}
          childTrees={elementTree.childTrees}
          onClick={onClick}
          isCompleted={false}
          stageId="elementTree1Child"
        />
      </MockTheme>,
    );

    expect(getByText("layout")).toBeInTheDocument();
    expect(getByText("elementTree1Child")).toBeInTheDocument();
    expect(queryByText("elementTree1Child2")).toBeNull();

    expect(container.querySelector(".selected-stage").textContent).toBe("elementTree1Child");

    fireEvent.click(getByText("layout"));
    expect(onClick).toBeCalledTimes(1);
    expect(onClick).toBeCalledWith("elementTree1");

    fireEvent.click(getByText("elementTree1Child"));
    expect(onClick).toBeCalledTimes(2);
    expect(onClick).toBeCalledWith("elementTree1Child");
  });

  test("should pass deeply nested challenge", () => {
    const onClick = jest.fn();
    const { elementTree } = deeplyNestedChallenge;
    const { container, getByText, queryByText } = render(
      <MockTheme>
        <StageList
          _id={elementTree._id}
          title={elementTree.title}
          childTrees={elementTree.childTrees}
          onClick={onClick}
          isCompleted={false}
          stageId="elementTree2GrandChild"
        />
      </MockTheme>,
    );

    expect(getByText("layout")).toBeInTheDocument();
    expect(getByText("elementTree2Child")).toBeInTheDocument();
    expect(getByText("elementTree2GrandChild")).toBeInTheDocument();

    expect(queryByText("elementTree2GrandChild2")).toBeNull();
    expect(queryByText("elementTree2GrandGrandChild")).toBeNull();

    expect(container.querySelector(".selected-stage").textContent).toBe("elementTree2GrandChild");

    fireEvent.click(getByText("layout"));
    expect(onClick).toBeCalledTimes(1);
    expect(onClick).toBeCalledWith("elementTree2");

    fireEvent.click(getByText("elementTree2Child"));
    expect(onClick).toBeCalledTimes(2);
    expect(onClick).toBeCalledWith("elementTree2Child");

    fireEvent.click(getByText("elementTree2GrandChild"));
    expect(onClick).toBeCalledTimes(3);
    expect(onClick).toBeCalledWith("elementTree2GrandChild");
  });
});
