import React, { useState } from "react";
import CompanyList from "./CompanyList";
import Search from "../common/Search";

/**
 * Display all companies, provide search bar
 */
function Companies() {
    const [searchTerm, setSearchTerm] = useState();

    return (
        <div className="Companies">
            <h2>Companies</h2>
            <Search fireSearch={setSearchTerm} />
            <CompanyList searchTerm={searchTerm} />
        </div>
    );
}

export default Companies;