import { React } from "react";
import { useTranslation } from "react-i18next";

import { Nav, Footer, Logo } from "./components/basicUI";

export default function App() {
    const { t, i18n } = useTranslation();

    // Set the web page title
    document.title = t("title");

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <>
            <Nav t={t} changeLanguage={changeLanguage} />
            <Footer t={t} />
        </>
    );
}