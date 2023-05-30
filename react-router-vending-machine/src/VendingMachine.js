import React from "react";

import Snack from "./Snack";

function VendingMachine() {
    return (
        <div className="VendingMachine">
            <h1>Vending Machine Online!</h1>
            <Snack name="Doritos" price="$2.99" />
            <Snack name="Tuna" price="$3.99" />
            <Snack name="Coke" price="$2.49" />
        </div>
    )
}

export default VendingMachine;