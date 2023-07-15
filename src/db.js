import * as Realm from "realm-web";

const id = { id: "login-hjvlc" };
export const app = new Realm.App(id);

const otherIds = [{ id: "mamu-ehyjq" }, { id: "timeline-wdzjm" }, { id: "readings-emlag" }, { id: "trivial-mxgqu" }];

export const login = async (email, password) => {
    try {
        // Create an email/password creadential
        const creadentials = Realm.Credentials.emailPassword(email, password);

        // Authenticate the user for the Login App
        const _ = await app.logIn(creadentials);

        // Log in the user via custom function for the rest of the apps
        for (const otherId of otherIds) {
            const otherApp = new Realm.App(otherId);
            const otherCredentials = Realm.Credentials.function({
                username: email,
                password: password
            });
            const _ = await otherApp.logIn(otherCredentials);
        }
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