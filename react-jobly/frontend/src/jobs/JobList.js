import React, { useEffect, useState } from "react";
import JobCard from "./JobCard";
import JoblyApi from "../api/api";

/**
 * List of jobs, can filter by searchTerm
 * 
 * If passed a list of companyJobs, display those instead of fetching
 */
function JobList({ searchTerm, companyJobs }) {
    const [jobs, setJobs] = useState(companyJobs ? companyJobs : []);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const jobList = await JoblyApi.getJobs(searchTerm ? searchTerm : null);
                setJobs(jobList);
            } catch (err) {
                console.error(err);
            }
        }

        if (!companyJobs) {
            fetchJobs();
        }
    }, [searchTerm, companyJobs]);

    const jobsComp = jobs.map(job => (
        <JobCard job={job} key={job.id} />
    ))
    return (
        <>
            {jobsComp}
        </>
    );
}

export default JobList;