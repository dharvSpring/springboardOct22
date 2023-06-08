import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardText, CardTitle } from "reactstrap";

/**
 * Company Card for display
 */
function CompanyCard({ company }) {
    return (
        <Card>
            <CardBody>
                <CardTitle><Link to={`/companies/${company.handle}`}>{company.name}</Link></CardTitle>
                <CardText>
                    {company.description}
                </CardText>
            </CardBody>
        </Card>
    );
}

export default CompanyCard;