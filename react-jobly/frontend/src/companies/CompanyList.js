import React, { useEffect, useState } from "react";
import CompanyCard from "./CompanyCard";
import JoblyApi from "../api/api";

/**
 * List of companies, can filter Company name by searchTerm
 */
function CompanyList({ searchTerm }) {
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const compList = await JoblyApi.getCompanies(searchTerm ? searchTerm : null);
                setCompanies(compList);
            } catch (err) {
                console.error(err);
                // FIXME show user error
            }
        }
        fetchCompanies();
    }, [searchTerm]);

    const companiesComp = companies.map(company => (
        <CompanyCard company={company} key={company.handle} />
    ))

    return (
        <>
            {companiesComp}
        </>
    );
}

export default CompanyList;