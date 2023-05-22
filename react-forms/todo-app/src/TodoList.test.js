import React from "react";
import { render, fireEvent } from "@testing-library/react";

import TodoList from "./TodoList";

function addTodo(todoList, text="submit to github") {
    const todoComp = todoList.getByLabelText("New Todo");
    fireEvent.change(todoComp, { target: { value: text }});

    const submitComp = todoList.getByText("Add Todo!");
    fireEvent.click(submitComp);
}

it("smoketest", function() {
    render(<TodoList />);
});

it("snapshot", function() {
    const { asFragment } = render(<TodoList />);
    expect(asFragment()).toMatchSnapshot();
});

it("add todo", function() {
    const list = render(<TodoList />);
    addTodo(list);
    
    expect(list.getByText("submit to github")).toBeInTheDocument();
    expect(list.getByText("X")).toBeInTheDocument();
    
    // form should be empty
    expect(list.getByLabelText("New Todo")).toHaveValue("");
});

it("delete todo", function() {
    const list = render(<TodoList />);
    addTodo(list);
    
    fireEvent.click(list.getByText("X"));
    expect(list.queryByText("submit to github")).not.toBeInTheDocument();
});