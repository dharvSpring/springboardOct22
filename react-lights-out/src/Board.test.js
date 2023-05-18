import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Board from "./Board";

describe("Board comp tests", function() {

    it("Board comp renders", function() {
        render(<Board />);
    });

    it("snapshot for full board", function() {
        const { asFragment } = render(<Board chanceLightStartsOn={1} />);
        expect(asFragment()).toMatchSnapshot();
    });

    it("win state: 'You Won!'", function() {
        const { getByText } = render(<Board chanceLightStartsOn={0} />);
        expect(getByText("You Won!")).toBeInTheDocument();
    });

    it("click to win", function() {
        const { queryByText, getAllByRole} = render(<Board ncols={3} nrows={1} chanceLightStartsOn={1} />);
        expect(queryByText("You Won!")).not.toBeInTheDocument();
        const cells = getAllByRole("button");

        // click center cell
        fireEvent.click(cells[1]);
        
        expect(queryByText("You Won!")).toBeInTheDocument();
    })

    it("click center to flip", function() {
        const { getAllByRole } = render(<Board ncols={3} nrows={3} chanceLightStartsOn={1} />);
        const cells = getAllByRole("button");
        cells.forEach(cell => {
            expect(cell).toHaveClass("Cell-lit");
        })
        
        // click center cell
        fireEvent.click(cells[4]);
        
        const cellsLitIdx = [0, 2, 6, 8];
        cells.forEach((cell, idx) => {
            if (cellsLitIdx.includes(idx)) {
                expect(cell).toHaveClass("Cell-lit");
            } else {
                expect(cell).not.toHaveClass("Cell-lit");
            }
        });
    })
});
