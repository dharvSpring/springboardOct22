import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Card from "./Card";

it("card smoketest no props", function() {
    render(<Card />);
});

it("card smoketest w/ props", function() {
    render(<Card caption="test" src="text" currNum="1" totalNum="1" />);
});

it("card snapshot w/ props", function() {
    const { asFragment } = render(<Card caption="test" src="text" currNum="1" totalNum="1" />);
    expect(asFragment()).toMatchSnapshot();
});