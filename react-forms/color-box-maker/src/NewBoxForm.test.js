import React from "react";
import { render } from "@testing-library/react";

import NewBoxForm from "./NewBoxForm";

it("smoketest", function() {
    render(<NewBoxForm />);
});

it("snapshot", function() {
    const { asFragment } = render(<NewBoxForm />);
    expect(asFragment()).toMatchSnapshot();
});
