import { Tabs, Tab } from "react-bootstrap";
import { LoginBackground } from "./loginBackground";

export function Register({ t }) {
    return (
        <>
            <LoginBackground />
            <Tabs
                fill
                defaultActiveKey="student"
                className="mt-3 mb-3" style={{ maxWidth: "960px" }}
            >
                <Tab eventKey="student" title={t("register.student.student")}>
                    <RegisterStudent t={t} />
                </Tab>
                <Tab eventKey="profile" title={t("register.teacher.teacher")}>
                </Tab>
            </Tabs>
        </>
    );
}

function RegisterStudent({ t }) {
    return (
        <div style={{ maxWidth: "960px" }}>
            <h1 className="text-center">{t("register.student.title")}</h1>
        </div>
    );
}

function RegisterTeacher({ t }) {
    return (
        <>
        </>
    );
}