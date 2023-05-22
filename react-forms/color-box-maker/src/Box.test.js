import React from "react";
import { render } from "@testing-library/react";

import Box from "./Box";

it("smoketest", function() {
    render(<Box />);
});

it("snapshot", function() {
    const { asFragment } = render(<Box />);
    expect(asFragment()).toMatchSnapshot();
});
