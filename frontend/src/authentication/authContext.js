import { createContext } from "react";

const authContext = createContext({
    authenticated: false,
    user: {},
    accessToken: "",
    initiateLogin: () => {},
    handleAuthentication: () => {},
    logout: () => {},
    loaded: false
});

export const AuthProvider = authContext.Provider;
export const AuthConsumer = authContext.Consumer;