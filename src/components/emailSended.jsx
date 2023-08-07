import { LoginBackground } from "./loginBackground";
import { Container } from "react-bootstrap";

export function EmailSended({ t }) {
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