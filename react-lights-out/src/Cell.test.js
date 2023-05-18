import React from "react";
import { render } from "@testing-library/react";
import Cell from "./Cell";

describe("Cell comp tests", function() {
    let row;

    beforeEach(function() {
        const tr = document.createElement("tr");
        row = document.body.appendChild(tr);
    });

    it("Cell comp renders", function() {
        render(<Cell />, { container: row });
    });

    it("snapshot not isLit", function() {
        const { asFragment } = render(<Cell />, { container: row });
        expect(asFragment()).toMatchSnapshot();
    });

    it("snapshot isLit", function() {
        const { asFragment } = render(<Cell isLit />, { container: row });
        expect(asFragment()).toMatchSnapshot();
    });
});
