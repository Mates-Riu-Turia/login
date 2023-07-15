import { useState } from "react";
import { Container, Form, Button, FloatingLabel } from "react-bootstrap";

import { sendResetEmail } from "../db";

export function ResetPassword({ t }) {
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
            return <EmailSended t={t} setStatus={setStatus} />;
        case "emailRecived":
            return <EmailRecived t={t} setStatus={setStatus} />;
        default:
            return <SendEmail t={t} setStatus={setStatus} />;
    }
}

function SendEmail({ t, setStatus }) {
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
            <Container className="d-flex flex-wrap justify-content-center justify-content-xl-start h-100 pt-5 mb-5">
                <div className="w-100 align-self-end pt-1 pt-md-4 pb-4" style={{ maxWidth: 526 }}>
                    <h1 className="text-center text-xl-start">{t("resetPassword.welcome")}</h1>

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

                        <Button variant="primary" type="submit" className="mt-3 mb-3 w-100">{t("resetPassword.send")}</Button>
                    </Form>
                </div>
            </Container >
        </>
    );
}