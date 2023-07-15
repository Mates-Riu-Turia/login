import { useState } from "react";
import { Container, Form, Button, FloatingLabel, Alert } from "react-bootstrap";

import { sendResetEmail } from "../db";

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

    if (token && tokenId) {
        setStatus("emailRecived");
    }

    switch (status) {
        case "sendEmail":
            return <SendEmail t={t} setStatus={setStatus} />;
        case "emailSended":
            return <EmailSended t={t} />;
        case "emailRecived":
            return <EmailRecived t={t} setStatus={setStatus} />;
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

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
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
        }

        setValidated(true);
    };


    return (
        <>
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
        <Container className="d-flex flex-wrap justify-content-center justify-content-xl-start h-100 pt-5 mb-5">
            <div className="w-100 align-self-end pt-1 pt-md-4 pb-4" style={{ maxWidth: 526 }}>
                <h3>{t("resetPassword.sended")}</h3>
                <img src="/login/images/email_sended.gif" width="526px" />
            </div>
        </Container>
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