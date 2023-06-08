import React, { useState } from "react";
import JobList from "./JobList";
import Search from "../common/Search";

/**
 * Display all jobs, provide search bar
 */
function Jobs() {
    const [searchTerm, setSearchTerm] = useState();

    return (
        <div className="Jobs">
            <h2>Apply to Jobs!</h2>
            <Search fireSearch={setSearchTerm} />
            <JobList searchTerm={searchTerm} />
        </div>
    );
}

export default Jobs;