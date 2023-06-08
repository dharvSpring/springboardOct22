import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import JoblyApi from "../api/api";
import JobList from "../jobs/JobList";

/**
 * Company Detail page, contains a list of all jobs for the company
 */
function CompanyDetail() {
    const { handle } = useParams();
    const [company, setCompany] = useState(null);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const companyData = await JoblyApi.getCompany(handle);
                setCompany(companyData);
            } catch (err) {
                console.error(err);
            }
        }
        fetchCompany();
    }, [handle]);

    if (!company) {
        return (
            <></>
        )
    }

    return (
        <div className="CompanyDetail">
            <h2>{company.name}</h2>
            <h6 className="subtitle">{company.description}</h6>
            <JobList companyJobs={company.jobs} />
        </div>
    );
}

export default CompanyDetail;