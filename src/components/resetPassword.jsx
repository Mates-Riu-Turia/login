import { useEffect, useState } from "react";
import { Container, Form, Button, FloatingLabel, Alert } from "react-bootstrap";

import {
    sendResetEmail, resetPassword
} from "../db";
import { LoginBackground } from "./loginBackground";

export function ResetPassword({ t }) {
    // Set the title of the page
    document.title = t("resetPassword.welcome");

    /* Possible component status
        - sendEmail -> Ask for email
        - emailSended -> The email was just sended, show a waiting screen
        - emailRecived -> Ask for the new password, only if we've got the tokens
    */
    const [status, setStatus] = useState("sendEmail");

    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    const tokenId = url.searchParams.get("tokenId");

    useEffect(() => {
        if (token && tokenId) {
            setStatus("emailRecived");
        }
    }, [token, tokenId, setStatus]);

    switch (status) {
        case "sendEmail":
            return <SendEmail t={t} setStatus={setStatus} />;
        case "emailSended":
            return <EmailSended t={t} />;
        case "emailRecived":
            return <EmailRecived t={t} token={token} tokenId={tokenId} />;
        default:
            return <SendEmail t={t} setStatus={setStatus} />;
    }
}

function SendEmail({ t, setStatus }) {
    // Show an error
    const [credentialError, setCredentialError] = useState(false);

    // Validate the form
    const [validated, setValidated] = useState(false);

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        setCredentialError(false);

        const email = document.getElementById("email").value;

        if (await sendResetEmail(email)) {
            // Manage errors
            setCredentialError(true);
        }
        else {
            // Change the status of the top level component
            setStatus("emailSended");
        }

        setValidated(true);
    };


    return (
        <>
            <LoginBackground />
            <CredentialsError t={t} show={credentialError} setShow={setCredentialError} />
            <Container className="d-flex flex-wrap justify-content-center justify-content-xl-start h-100 pt-5 mb-5">
                <div className="w-100 align-self-end pt-1 pt-md-4 pb-4" style={{ maxWidth: 526 }}>
                    <h1 className="text-center text-xl-start">{t("resetPassword.welcome")}</h1>

                    <p>{t("resetPassword.help")}</p>

                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <FloatingLabel
                            controlId="email"
                            label={t("email")}
                            className="mb-3"
                        >
                            <Form.Control required type="email" placeholder="" />
                            <Form.Control.Feedback>{t("verify.ok")}</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">{t("verify.email")}</Form.Control.Feedback>
                        </FloatingLabel>

                        <Button variant="primary" type="submit" className="mt-3 mb-3 w-100">{t("resetPassword.welcome")}</Button>
                    </Form>
                </div>
            </Container >
        </>
    );
}

function EmailSended({ t }) {
    return (
        <>
            <LoginBackground />
            <Container className="d-flex flex-wrap justify-content-center justify-content-xl-start h-100 pt-5 mb-5">
                <div className="w-100 align-self-end pt-1 pt-md-4 pb-4" style={{ maxWidth: 526 }}>
                    <h3>{t("resetPassword.sended")}</h3>
                    <img src="/login/images/email_sended.gif" width="526px" />
                </div>
            </Container>
        </>
    );
}

function EmailRecived({ t, token, tokenId }) {
    const [credentialError, setCredentialError] = useState(false);

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

    // Validate the form
    const [validated, setValidated] = useState(false);

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        setCredentialError(false);

        const password = document.getElementById("password").value;
        const repassword = document.getElementById("repeat-password").value;

        if (password === repassword) {
            if (await resetPassword(password, token, tokenId)) {
                // Manage errors
                setCredentialError(true);
            }
            else {
                // Redirect to the login page
                window.location.href = "/login/"
            }
        }
        else {
            document.getElementById("repeat-password").value = "";
        }

        setValidated(true);
    };

    return (
        <>
            <LoginBackground />
            <CredentialsError t={t} show={credentialError} setShow={setCredentialError} />
            <Container className="d-flex flex-wrap justify-content-center justify-content-xl-start h-100 pt-5 mb-5">
                <div className="w-100 align-self-end pt-1 pt-md-4 pb-4" style={{ maxWidth: 526 }}>
                    <h1 className="text-center text-xl-start">{t("resetPassword.welcome")}</h1>

                    <p>{t("resetPassword.help2")}</p>

                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
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

                        <Button variant="primary" type="submit" className="mt-3 mb-3 w-100">{t("resetPassword.welcome")}</Button>
                    </Form>
                </div>
            </Container >
        </>
    );
}

function CredentialsError({ t, show, setShow }) {
    if (show) {
        return (
            <Alert className="mt-2" variant="danger" onClose={() => setShow(false)} dismissible>
                {t("resetPassword.error")}
            </Alert>
        );
    }
}