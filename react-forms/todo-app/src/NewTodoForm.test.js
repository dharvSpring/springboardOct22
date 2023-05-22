import React from "react";
import { render, fireEvent } from "@testing-library/react";

import NewTodoForm from "./NewTodoForm";

it("smoketest", function() {
    render(<NewTodoForm />);
});

it("snapshot", function() {
    const { asFragment } = render(<NewTodoForm />);
    expect(asFragment()).toMatchSnapshot();
});

it("calls create on submit", function () {
    const createFnMock = jest.fn();
    const { getByText } = render(<NewTodoForm handleSubmit={createFnMock} />);
    
    const addButton = getByText("Add Todo!");
    fireEvent.click(addButton);
    expect(createFnMock).toHaveBeenCalled();
});