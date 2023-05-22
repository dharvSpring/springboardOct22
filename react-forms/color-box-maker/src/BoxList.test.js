import React from "react";
import { render, fireEvent } from "@testing-library/react";

import BoxList from "./BoxList";

function addBox(boxList, width="200", height="200", bgColor = "cornflowerblue") {
    const widthInput = boxList.getByLabelText("Width");
    const heightInput = boxList.getByLabelText("Height");
    const backgroundInput = boxList.getByLabelText("Background Color");

    fireEvent.change(widthInput, { target: { value: width } });
    fireEvent.change(heightInput, { target: { value: height } });
    fireEvent.change(backgroundInput, { target: { value: bgColor } });

    const button = boxList.getByText("Add Box!");
    fireEvent.click(button);
}

it("smoketest", function() {
    render(<BoxList />);
});

it("snapshot", function() {
    const { asFragment } = render(<BoxList />);
    expect(asFragment()).toMatchSnapshot();
});

it("can add a new box", function() {
    const boxList = render(<BoxList />);

    // start with no box
    expect(boxList.queryByText("Remove Me!")).not.toBeInTheDocument();
    addBox(boxList);

    // check new box
    const removeButton = boxList.getByText("Remove Me!");
    expect(removeButton).toBeInTheDocument();
    expect(removeButton.previousSibling).toHaveStyle(`
        width: 200px;
        height: 200px;
        background-color: cornflowerblue;
    `);

    // empty form
    expect(boxList.getAllByDisplayValue("")).toHaveLength(3);
});

it("can remove box", function() {
    const boxList = render(<BoxList />);
    addBox(boxList);
    const removeButton = boxList.getByText("Remove Me!");

    // click to remove
    fireEvent.click(removeButton);

    expect(removeButton).not.toBeInTheDocument();
});
