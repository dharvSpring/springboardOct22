import React, { useContext } from "react";
import { Card, CardBody, CardText, CardTitle } from "reactstrap";
import UserContext from "../auth/UserContext";
import { Link } from "react-router-dom";

/**
 * Homepage, it's not that exciting
 */
function JoblyHome() {
    const { currentUser } = useContext(UserContext);

    return (
        <div>
            <Card>
                <CardBody className="text-center">
                    <CardTitle>
                        <h1>Jobs!</h1>
                    </CardTitle>
                    <CardText>You need one!</CardText>

                    {currentUser.loaded ? <h3>Welcome {currentUser.data.firstName}!</h3> : (
                        <>
                            <Link to="/login" className="btn btn-secondary mx-1">Login</Link>
                            or
                            <Link to="/signup" className="btn btn-secondary mx-1">Sign Up</Link>
                        </>
                    )}
                </CardBody>
            </Card>
        </div>
    )
}

export default JoblyHome;