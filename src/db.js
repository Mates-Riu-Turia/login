import * as Realm from "realm-web";

import { generateAvatar } from "./avatar";

const id = { id: "login-hjvlc" };
export const app = new Realm.App(id);

const otherIds = [{ id: "mamu-ehyjq" }, { id: "timeline-wdzjm" }, { id: "readings-emlag" }, { id: "trivial-mxgqu" }];

export const login = async (email, password) => {
    try {
        // Create an email/password creadential
        const creadentials = Realm.Credentials.emailPassword(email, password);

        // Authenticate the user for the Login App
        const user = await app.logIn(creadentials);

        // Log in the user via custom function for the rest of the apps
        let apps = [];
        for (const otherId of otherIds) {
            const otherApp = new Realm.App(otherId);
            const otherCredentials = Realm.Credentials.function({
                username: email,
                password: password
            });
            apps.push(otherApp.logIn(otherCredentials));
        }
        await Promise.all(apps);

        if (localStorage.getItem("name") !== null) {
            if (await saveTempData()) {
                throw new Error("");
            }
        }

        generateAvatar(user.customData.name + user.customData.surname);
    }
    catch {
        return true;
    }

    return false;
};

export const logout = async () => {
    try {
        let apps = [app.currentUser.logOut()];
        for (const otherId of otherIds) {
            const otherApp = new Realm.App(otherId);
            apps.push(otherApp.currentUser.logOut());
        }
        await Promise.all(apps);
    }
    catch {
        return true;
    }
    return false;
};

export const sendResetEmail = async (email) => {
    try {
        await app.emailPasswordAuth.sendResetPasswordEmail({ email });
    }
    catch {
        return true;
    }
    return false;
};

export const resetPassword = async (password, token, tokenId) => {
    try {
        await app.emailPasswordAuth.resetPassword({
            password,
            token,
            tokenId,
        });
    }
    catch {
        return true;
    }
    return false;
};

export const sendRegisterEmail = async (email, password, name, surname, gender, course, classVal) => {
    try {
        await app.emailPasswordAuth.registerUser({
            email,
            password
        });

        // Save the temporal data in the localStorage
        localStorage.setItem("name", name);
        localStorage.setItem("surname", surname);
        localStorage.setItem("gender", gender);
        localStorage.setItem("course", course);
        localStorage.setItem("class", classVal);
    }
    catch {
        return true;
    }
    return false;
}

export const finishRegister = async (token, tokenId) => {
    try {
        await app.emailPasswordAuth.confirmUser({ token, tokenId });
    }
    catch {
        return true;
    }
    return false;
}

const saveTempData = async () => {
    try {
        const mongo = app.currentUser.mongoClient("mongodb-atlas");
        const collection = mongo.db("user-data").collection("user-data");

        const name = localStorage.getItem("name");
        const surname = localStorage.getItem("surname");
        const gender = localStorage.getItem("gender");
        const course = localStorage.getItem("course");
        const classVal = localStorage.getItem("class");

        await collection.updateOne(
            { user_id: app.currentUser.id },
            {
                $set: {
                    name,
                    surname,
                    gender,
                    course,
                    class: classVal
                }
            }
        );

        localStorage.removeItem("name");
        localStorage.removeItem("surname");
        localStorage.removeItem("gender")
        localStorage.removeItem("course");
        localStorage.removeItem("class");
    }
    catch {
        return true;
    }
    return false;
};

export const resendConfirmationEmail = async (email) => {
    await app.emailPasswordAuth.resendConfirmationEmail({ email });
}