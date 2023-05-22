import React from "react";
import { render } from "@testing-library/react";

import App from "./App";

it("smoketest", function() {
    render(<App />);
});

it("snapshot", function() {
    const { asFragment } = render(<App />);
    expect(asFragment()).toMatchSnapshot();
});