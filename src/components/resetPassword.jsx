import { useEffect, useState } from "react";
import { Container, Form, Button, FloatingLabel, Alert } from "react-bootstrap";

import {
    sendResetEmail, resetPassword
} from "../db";
import { LoginBackground } from "./loginBackground";
import { EmailSended } from "./emailSended";
import { usePassword } from "../hooks/usePassword";

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

    const [resetPasswordEmail, setResetPasswordEmail] = useState("");

    switch (status) {
        case "sendEmail":
            return <SendEmail t={t} setStatus={setStatus} setResetPasswordEmail={setResetPasswordEmail} />;
        case "emailSended":
            return <EmailSended t={t} resend={() => sendResetEmail(resetPasswordEmail)} />;
        case "emailRecived":
            return <EmailRecived t={t} token={token} tokenId={tokenId} />;
        default:
            return <SendEmail t={t} setStatus={setStatus} />;
    }
}

function SendEmail({ t, setStatus, setResetPasswordEmail }) {
    // Show an error
    const [credentialError, setCredentialError] = useState(false);

    // Validate the form
    const [validated, setValidated] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setCredentialError(false);

        // Get form data
        const formRaw = new FormData(event.target);
        const form = Object.fromEntries(formRaw.entries());

        if (await sendResetEmail(form.email)) {
            // Manage errors
            setCredentialError(true);
        }
        else {
            // Save the user's email in case of retrying
            setResetPasswordEmail(form.email);
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
                            ç label={t("email")}
                            className="mb-3"
                        >
                            <Form.Control name="email" required type="email" placeholder="" />
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

function EmailRecived({ t, token, tokenId }) {
    const [credentialError, setCredentialError] = useState(false);

    const [passwordVisibility, changePasswordVisibility] = usePassword();

    const [passwordVisibility2, changePasswordVisibility2] = usePassword();

    // Validate the form
    const [validated, setValidated] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setCredentialError(false);

        // Get form data
        const formRaw = new FormData(event.target);
        const form = Object.fromEntries(formRaw.entries());

        if (form.password === form.repassword) {
            if (await resetPassword(form.password, token, tokenId)) {
                // Manage errors
                setCredentialError(true);
            }
            else {
                // Redirect to the login page
                window.location.href = "/login/"
            }
        }
        else {
            form.repassword = "";
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
                        <FloatingLabel label={t("password")} className="mb-3">
                            <Form.Control name="password" required type={passwordVisibility.status} placeholder="" />

                            <div className="position-relative">
                                <button className="password-toggle" type="button" onClick={changePasswordVisibility}>
                                    <i className={passwordVisibility.icon}></i>
                                </button>
                            </div>

                            <Form.Control.Feedback>{t("verify.ok")}</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">{t("verify.password")}</Form.Control.Feedback>
                        </FloatingLabel>

                        <FloatingLabel label={t("password")}>
                            <Form.Control name="repassword" required type={passwordVisibility2.status} placeholder="" />

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