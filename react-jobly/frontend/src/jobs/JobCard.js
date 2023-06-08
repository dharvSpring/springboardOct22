import React, { useContext } from "react";
import { Button, Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import UserContext from "../auth/UserContext";
import JoblyApi from "../api/api";

/**
 * Job Card for display. Can apply to jobs.
 */
function JobCard({ job }) {
    const { currentUser, jobsApplied, setJobsApplied } = useContext(UserContext);

    const applyToJob = () => {
        const sendApplication = async () => {
            try {
                await JoblyApi.applyToJob(currentUser.data.username, job.id);
                setJobsApplied(applied => ([
                    ...applied,
                    job.id,
                ]));
            } catch (err) {
                console.error(err);
            }
        }
        sendApplication();
    }

    const applied = jobsApplied.includes(job.id);

    return (
        <Card>
            <CardBody>
                <CardTitle>{job.title}</CardTitle>
                <CardSubtitle>{job.companyName}</CardSubtitle>
                    {job.salary && job.salary > 0 ? <div>Salary: {job.salary}</div> : null}
                    {job.equity && job.equity > 0 ? <div>Equity: {job.equity}</div> : null}
                <Button className={`float-end ${applied ? 'disabled' : ''}`} color="primary" onClick={applyToJob}>Apply</Button>
            </CardBody>
        </Card>
    );
}

export default JobCard;