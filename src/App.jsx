import { React } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Nav, Footer } from "./components/basicUI";
import { LoginForm } from "./components/loginForm";
import { NotFound } from "./components/notFound";
import { ResetPassword } from "./components/resetPassword";
import { Logout } from "./components/logout";
import { Account } from "./components/account";
import { Register } from "./components/register";

export default function App() {
    const { t, i18n } = useTranslation();

    // Set the web page title
    document.title = t("title");

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <Router>
            <Nav t={t} changeLanguage={changeLanguage} />
            <Routes>
                <Route path="/login/" element={
                    <LoginForm t={t} />
                } />
                <Route path="/login/reset_password" element={
                    <ResetPassword t={t} />
                } />
                <Route path="/login/logout" element={
                    <Logout t={t} />
                } />
                <Route path="/login/account" element={
                    <Account t={t} />
                } />
                <Route path="/login/register" element={
                    <Register t={t} />
                } />
                <Route path="*" element={
                    <NotFound t={t} />
                } />
            </Routes>
            <Footer t={t} />
        </Router>
    );
}