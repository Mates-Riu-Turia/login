import { useState, React } from "react";
import { Container, FloatingLabel, Form, Button, Alert } from "react-bootstrap";

import { login, app } from "../db";

export function LoginForm({ t }) {
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


    const [validated, setValidated] = useState(false);

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            setCredentialError(false);

            const user = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            if (await login(user, password)) {
                document.getElementById("email").value = "";
                document.getElementById("password").value = "";
                setCredentialError(true);
            }
            else {
                window.location.href = redirectPage;
            }
        }

        setValidated(true);
    };

    const url = new URL(window.location.href);
    const redirectTo = url.searchParams.get("redirectTo");

    let redirectName;
    let redirectPage;

    switch (redirectTo) {
        case "museum":
            redirectName = t("logIn.redirect.museum");
            redirectPage = "/math_museum";
            break;
        case "timeline":
            redirectName = t("logIn.redirect.timeline");
            redirectPage = "/math_timeline";
            break;
        case "readings":
            redirectName = t("logIn.redirect.readings");
            redirectPage = "/math_readings";
            break;
        case "trivial":
            redirectName = t("logIn.redirect.trivial");
            redirectPage = "/trivial";
            break;
        default:
            redirectName = t("logIn.redirect.account");
            redirectPage = "/login/account";
            break;
    }

    if (app.currentUser) {
        window.location.href = redirectPage;
    }

    redirectName = t("logIn.goto") + redirectName;

    return (
        <>
            <CredentialsError t={t} show={credentialError} setShow={setCredentialError} />
            <Container className="d-flex flex-wrap justify-content-center justify-content-xl-start h-100 pt-5 mb-5">
                <div className="w-100 align-self-end pt-1 pt-md-4 pb-4" style={{ maxWidth: 526 }}>
                    <h1 className="text-center text-xl-start">{t("logIn.welcome")}</h1>
                    <h6>{redirectName}</h6>

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

                        <FloatingLabel controlId="password" label={t("password")}>
                            <Form.Control required type={passwordVisibility.status} placeholder="" />

                            <div style={{ position: "relative" }}>
                                <button className="password-toggle" type="button" onClick={changePasswordVisibility}>
                                    <i className={passwordVisibility.icon}></i>
                                </button>
                            </div>

                            <Form.Control.Feedback>{t("verify.ok")}</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">{t("verify.password")}</Form.Control.Feedback>
                        </FloatingLabel>

                        <Button variant="primary" type="submit" className="mt-3 mb-3 w-100">{t("logIn.logIn")}</Button>
                    </Form>
                    <a className="btn w-100" href="#">
                        {t("logIn.forgotten")}
                    </a>

                    <hr className="my-4" />
                    <p className="text-center text-xl-start pb-3 mb-3">
                        {t("logIn.notAccountYet")}
                        <a href="account-signup.html">{t("logIn.register")}</a>
                    </p>
                </div>
            </Container >
        </>
    );
}

function CredentialsError({ t, show, setShow }) {
    if (show) {
        return (
            <Alert className="mt-2" variant="danger" onClose={() => setShow(false)} dismissible>
                {t("logIn.invalid")}
            </Alert>
        );
    }
}