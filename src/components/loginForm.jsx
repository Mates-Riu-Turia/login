import { useState, React } from "react";
import { Container, FloatingLabel, Form, Button } from "react-bootstrap";

import { login } from "../db";

export function LoginForm({ t }) {
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

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            login("asengar2009@gmail.com", "prueba");

        }

        setValidated(true);

    };

    const url = new URL(window.location.href);
    const redirectTo = url.searchParams.get("redirectTo");

    let redirectName;

    switch (redirectTo) {
        case "museum":
            redirectName = t("logIn.redirect.museum");
            break;
        case "timeline":
            redirectName = t("logIn.redirect.timeline");
            break;
        case "readings":
            redirectName = t("logIn.redirect.readings");
            break;
        case "trivial":
            redirectName = t("logIn.redirect.trivial");
            break;
        default:
            redirectName = t("logIn.redirect.account");
            break;
    }

    redirectName = t("logIn.goto") + redirectName;

    return (
        <Container className="d-flex flex-wrap justify-content-center justify-content-xl-start h-100 pt-5 mb-5">
            <div className="w-100 align-self-end pt-1 pt-md-4 pb-4" style={{ maxWidth: 526 }}>
                <h1 className="text-center text-xl-start">{t("logIn.welcome")}</h1>
                <h6>{redirectName}</h6>

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <FloatingLabel
                        controlId="floatingInput"
                        label={t("email")}
                        className="mb-3"
                    >
                        <Form.Control required type="email" placeholder="" />
                        <Form.Control.Feedback>{t("verify.ok")}</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">{t("verify.email")}</Form.Control.Feedback>
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingPassword" label={t("password")}>
                        <Form.Control required type={passwordVisibility.status} placeholder="" />

                        <div style={{position: "relative"}}>
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
    );
}