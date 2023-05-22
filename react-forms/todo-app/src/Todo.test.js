import React from "react";
import { render, fireEvent } from "@testing-library/react";

import Todo from "./Todo";

it("smoketest", function() {
    render(<Todo />);
});

it("snapshot", function() {
    const { asFragment } = render(<Todo />);
    expect(asFragment()).toMatchSnapshot();
});

it("calls remove on click", function () {
    const removeFnMock = jest.fn();
    const { getByText } = render(<Todo id="1" text="Remove Me" handleRemove={removeFnMock} />);
    
    const removeButton = getByText("X");
    fireEvent.click(removeButton);
    expect(removeFnMock).toHaveBeenCalled();
});