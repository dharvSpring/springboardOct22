import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardText, CardTitle } from "reactstrap";

function JoblyHome() {
    return (
        <section className="col-md-8">
            <Card>
                <CardBody className="text-center">
                    <CardTitle>
                        <h1 className="font-weight-bold">
                            Jobly!
                        </h1>
                    </CardTitle>
                    <CardText className="font-italic">You need one!</CardText>

                    {/* Choose from <Link to="/snacks">{snacks.length} snacks</Link> and <Link to="/drinks">{drinks.length} beverages</Link>. */}
                </CardBody>
            </Card>
        </section >
    )
}

export default JoblyHome;