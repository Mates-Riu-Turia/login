import { Container, FloatingLabel, Form, Button } from "react-bootstrap";

export function LoginForm({ t }) {
    const url = new URL(window.location.href);
    const redirectTo = url.searchParams.get("redirectTo");

    let redirectName;

    switch (redirectTo) {
        case "museum":
            redirectName = t("redirect.museum");
            break;
        case "timeline":
            redirectName = t("redirect.timeline");
            break;
        case "readings":
            redirectName = t("redirect.readings");
            break;
        case "trivial":
            redirectName = t("redirect.trivial");
            break;
        default:
            redirectName = t("redirect.account");
            break;
    }

    console.log(redirectName)

    return (
        <Container className="d-flex flex-wrap justify-content-center justify-content-xl-start h-100 pt-5 mb-5">
            <div className="w-100 align-self-end pt-1 pt-md-4 pb-4" style={{ maxWidth: 526 }}>
                <h1 className="text-center text-xl-start">Welcome Back</h1>
                <h6>Go to {redirectName}</h6>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Email address"
                    className="mb-3"
                >
                    <Form.Control type="email" placeholder="name@example.com" />
                </FloatingLabel>
                <FloatingLabel controlId="floatingPassword" label="Password">
                    <Form.Control type="password" placeholder="Password" />
                </FloatingLabel>

                <Button variant="primary" className="mt-3 mb-3 w-100">Log in</Button>
                <a class="btn w-100" href="#">
                    Password forgotten?
                </a>

                <hr className="my-4" />
                <p className="text-center text-xl-start pb-3 mb-3">
                    Don’t have an account yet?
                    <a href="account-signup.html">Register here.</a>
                </p>
            </div>
        </Container >
    );
}