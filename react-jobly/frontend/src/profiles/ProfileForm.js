import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, FormGroup, Input, Label } from "reactstrap";
import Alerts from "../common/Alerts";
import UserContext from "../auth/UserContext";
import JoblyApi from "../api/api";

/**
 * Profile Edit Form
 */
function ProfileForm() {
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const navigate = useNavigate();

    const initFormData = {
        firstName: '',
        lastName: '',
        email: '',
    };
    const [formData, setFormData] = useState(initFormData);
    const [formMsgs, setFormMsgs] = useState({ type: 'danger', msgs: [] });


    useEffect(() => {
        setFormData({
            username: currentUser.loaded ? currentUser.data.username : formData.username,
            firstName: currentUser.loaded ? currentUser.data.firstName : formData.firstName,
            lastName: currentUser.loaded ? currentUser.data.lastName : formData.lastName,
            email: currentUser.loaded ? currentUser.data.email : formData.email,
        });
    }, [currentUser]);

    /** Try to create the user. Success? -> /companies */
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        const updateForm = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
        }

        let updatedUser;
        try {
            updatedUser = JoblyApi.saveProfile(currentUser.data.username, updateForm);
            setFormMsgs({ type: 'danger', msgs: [] });
        } catch (err) {
            console.error(err);
            setFormMsgs({ type: 'danger', msgs: [err] });
        }

        if (updatedUser) {
            setCurrentUser(user => ({
                loaded: user.loaded,
                data: {
                    ...updateForm,
                    username: user.data.username,
                },
            }));
            setFormMsgs({ type: 'success', msgs: ['User updated'] });
            navigate("/profile");
        } else {
            console.error("Failed to update User");
            setFormMsgs({ type: 'danger', msgs: ['Failed to update User'] });
        }
    }

    /** Update form data field */
    function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData(data => ({
            ...data,
            [name]: value
        }));
    }

    return (
        <div className="ProfileForm container col-md-6">
            <h2>Edit Profile</h2>
            <Card>
                <CardBody>
                    <form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label htmlFor="username">Username</Label>
                            <Input name="username" type="text" value={formData.username} disabled />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input name="firstName" type="text" value={formData.firstName} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input name="lastName" type="text" value={formData.lastName} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="email">Email</Label>
                            <Input name="email" type="text" value={formData.email} onChange={handleChange} required />
                        </FormGroup>

                        {formMsgs.msgs.length > 0 ?
                            <Alerts type={formMsgs.type} messages={formMsgs.msgs} /> : null
                        }

                        <FormGroup>
                            <Input type="submit" className="btn btn-secondary" value="Save" onSubmit={handleSubmit} />
                        </FormGroup>
                    </form>
                </CardBody>
            </Card>


        </div>
    )
}

export default ProfileForm;