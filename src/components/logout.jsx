import { useEffect } from "react";
import { logout } from "../db";

export function Logout({ t }) {
    useEffect(() => {
        const login_sync = async () => {
            await logout();
        }
        login_sync();
    }, []);
}