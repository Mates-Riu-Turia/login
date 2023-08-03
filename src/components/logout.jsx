import { useEffect } from "react";
import { logout } from "../db";

export function Logout({ t }) {
    useEffect(() => {
        const login_sync = async () => {
            await logout();
        }
        login_sync();
    }, []);

    return (
        <div className="position-absolute top-50 start-50 translate-middle text-center">
            <img src="/login/images/favicon_org.ico" alt="Logo" className="d-inline-block align-text-middle" />
            <h1>{t("logOut.thanks")}</h1>
            <h4>
                {t("logOut.logInAgain")}
                <a href="/login/">{t("logOut.logInAgainLink")}</a>
            </h4>
        </div>
    );
}