import { React, useState } from "react";

import { useTranslation } from "react-i18next";

export default function App() {
    const {t, i18n} = useTranslation();

    // Set the web page title
    document.title = t("title");
}