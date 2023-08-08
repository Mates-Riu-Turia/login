import { useState, useEffect } from "react";
import { Tabs, Tab, Alert, Form, FloatingLabel, Row, Col, Button } from "react-bootstrap";
import { LoginBackground } from "./loginBackground";
import { finishRegister, sendRegisterEmail, resendConfirmationEmail } from "../db";
import { EmailSended } from "./emailSended";

export function Register({ t }) {
    // Set the title of the page
    document.title = t("register.title");

    /* Possible component status
        - sendEmail -> Ask for the email and password (this data is sended with the registerUser() from MongoDB Realm)
                       the other data like name, is saved in the localStorage
        - emailSended -> The email was just sended, show a waiting screen
        - emailRecived -> If the tokens are correct, save the data from localStorage in the user's customData from 
                          MongoDB and then redirect to the login page
    */
    const [status, setStatus] = useState("sendEmail");

    // Read the URL
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    const tokenId = url.searchParams.get("tokenId");

    /* 
        * Check if the email is recived
        * We use useEffect for preventing an inifinite loop. If the condition is true
        * we change the status, and every time that we change the status, we re-render, i.e.: inifinite loop
    */
    useEffect(() => {
        if (token && tokenId) {
            setStatus("emailRecived");
        }
    }, [token, tokenId, setStatus]);

    // This state saves the email in case of resend
    const [confirmationEmail, setConfirmationEmail] = useState("");

    // Render the correct components
    switch (status) {
        case "sendEmail":
            return <SendEmail t={t} setStatus={setStatus} setConfirmationEmail={setConfirmationEmail} />;
        case "emailSended":
            return <EmailSended t={t} resend={() => resendConfirmationEmail(confirmationEmail)} />
        case "emailRecived":
            return <EmailRecived t={t} token={token} tokenId={tokenId} />;
        default:
            return <SendEmail t={t} setStatus={setStatus} setConfirmationEmail={setConfirmationEmail} />;
    };
}

// The SendEmail component and subcomponents

function SendEmail({ t, setStatus, setConfirmationEmail }) {
    return (
        <>
            <LoginBackground />
            <Tabs
                fill
                defaultActiveKey="student"
                className="mt-3 mb-3" style={{ maxWidth: "960px" }}
            >
                <Tab eventKey="student" title={t("register.student.student")}>
                    <RegisterStudent t={t} setStatus={setStatus} setConfirmationEmail={setConfirmationEmail} />
                </Tab>
                <Tab eventKey="profile" title={t("register.teacher.teacher")}>
                </Tab>
            </Tabs>
        </>
    );
}

function RegisterStudent({ t, setStatus, setConfirmationEmail }) {
    // Show an error
    const [registerError, setRegisterError] = useState(false);


    // This states and functions are for showing or not the password in plain text
    const [passwordVisibility, setPasswordVisibility] = useState({
        status: "password",
        icon: "bi bi-eye-fill",
    })

    const changePasswordVisibility = () => {
        if (passwordVisibility.status == "password") {
            setPasswordVisibility(
                {
                    status: "text",
                    icon: "bi bi-eye-slash-fill",
                }
            );
        }

        else {
            setPasswordVisibility(
                {
                    status: "password",
                    icon: "bi bi-eye-fill",
                }
            );
        }
    };

    const [passwordVisibility2, setPasswordVisibility2] = useState({
        status: "password",
        icon: "bi bi-eye-fill",
    })

    const changePasswordVisibility2 = () => {
        if (passwordVisibility2.status == "password") {
            setPasswordVisibility2(
                {
                    status: "text",
                    icon: "bi bi-eye-slash-fill",
                }
            );
        }

        else {
            setPasswordVisibility2(
                {
                    status: "password",
                    icon: "bi bi-eye-fill",
                }
            );
        }
    };

    // This state saves if the form was processed or not
    const [validated, setValidated] = useState(false);

    // This function validates the form
    const handleSubmit = async (event) => {
        // Don't let the browser do its own check
        event.preventDefault();
        // Remove previous errors
        setRegisterError(false);

        // Get all the personal information
        const name = document.getElementById("name").value;
        const surname = document.getElementById("surname").value;
        const course = document.getElementById("course").value;
        const classVal = document.getElementById("class").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const repassword = document.getElementById("repeat-password");

        // Check if passwords match
        if (password != repassword.value) {
            repassword.value = "";
        }
        else {
            // Send the email and check for errors
            if (await sendRegisterEmail(email, password, name, surname, course, classVal)) {
                setRegisterError(true);
            }
            else {
                setConfirmationEmail(email);
                setStatus("emailSended");
            }
        }

        setValidated(true);
    };

    return (
        <div style={{ maxWidth: "960px" }}>
            <RegisterError t={t} show={registerError} setShow={setRegisterError} />

            <h1 className="text-center">{t("register.student.title")}</h1>
            <Alert variant="info">
                <i className="bi bi-info-circle-fill"></i>
                {t("register.student.help")}
            </Alert>

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <FloatingLabel
                            controlId="name"
                            label={t("register.name")}
                            className="mb-3"
                        >
                            <Form.Control required type="text" placeholder="" />
                            <Form.Control.Feedback>{t("verify.ok")}</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">{t("verify.name")}</Form.Control.Feedback>
                        </FloatingLabel>
                    </Col>
                    <Col>
                        <FloatingLabel
                            controlId="surname"
                            label={t("register.surname")}
                            className="mb-3"
                        >
                            <Form.Control required type="text" placeholder="" />
                            <Form.Control.Feedback>{t("verify.ok")}</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">{t("verify.surname")}</Form.Control.Feedback>
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FloatingLabel
                            controlId="course"
                            label={t("register.student.course")}
                            className="mb-3"
                        >
                            <Form.Select className="mb-3">
                                <option value="1">{t("register.courses.1")}</option>
                                <option value="2">{t("register.courses.2")}</option>
                                <option value="3">{t("register.courses.3")}</option>
                                <option value="4">{t("register.courses.4")}</option>
                                <option value="5">{t("register.courses.5")}</option>
                                <option value="6">{t("register.courses.6")}</option>
                            </Form.Select>
                            <Form.Control.Feedback>{t("verify.ok")}</Form.Control.Feedback>
                        </FloatingLabel>
                    </Col>
                    <Col>
                        <FloatingLabel
                            controlId="class"
                            label={t("register.student.class")}
                            className="mb-3"
                        >
                            <Form.Select className="mb-3">
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                                <option value="E">E</option>
                            </Form.Select>
                            <Form.Control.Feedback>{t("verify.ok")}</Form.Control.Feedback>
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row>
                    <FloatingLabel
                        controlId="email"
                        label={t("email")}
                        className="mb-3"
                    >
                        <Form.Control required type="email" placeholder="" />
                        <Form.Control.Feedback>{t("verify.ok")}</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">{t("verify.email")}</Form.Control.Feedback>
                    </FloatingLabel>
                </Row>
                <Row>
                    <FloatingLabel controlId="password" label={t("password")} className="mb-3">
                        <Form.Control required type={passwordVisibility.status} placeholder="" />

                        <div className="position-relative">
                            <button className="password-toggle" type="button" onClick={changePasswordVisibility}>
                                <i className={passwordVisibility.icon}></i>
                            </button>
                        </div>

                        <Form.Control.Feedback>{t("verify.ok")}</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">{t("verify.password")}</Form.Control.Feedback>
                    </FloatingLabel>
                </Row>
                <Row>
                    <FloatingLabel controlId="repeat-password" label={t("password")}>
                        <Form.Control required type={passwordVisibility2.status} placeholder="" />

                        <div className="position-relative">
                            <button className="password-toggle" type="button" onClick={changePasswordVisibility2}>
                                <i className={passwordVisibility2.icon}></i>
                            </button>
                        </div>

                        <Form.Control.Feedback>{t("verify.ok")}</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">{t("verify.password")}</Form.Control.Feedback>
                    </FloatingLabel>

                </Row>

                <Button variant="primary" type="submit" className="mt-3 mb-3 w-100">{t("register.btn")}</Button>
            </Form>
        </div>
    );
}

function RegisterTeacher({ t }) {
    return (
        <>
        </>
    );
}

function EmailRecived({ t, token, tokenId }) {
    useEffect(() => {
        const finishRegisterSync = async (token, tokenId) => {
            if (!(await finishRegister(token, tokenId))) {
                window.location.href = "/login/";
            }
        };
        finishRegisterSync(token, tokenId);
    }, [token, tokenId]);

    return (
        <RegisterError t={t} show={true} setShow={() => { }} />
    );
}

function RegisterError({ t, show, setShow }) {
    if (show) {
        return (
            <Alert className="mt-2" variant="danger" onClose={() => setShow(false)} dismissible>
                {t("register.error")}
            </Alert>
        );
    }
}