import { useEffect } from "react";
import { logout } from "../db";

export function Logout({ t }) {
    useEffect(() => {
        const login_sync = async () => {
            let result = await logout();
            console.log(result)
        }
        login_sync();
    }, []);
}