import { createContext, useReducer, useState } from "react";
import cookie from "react-cookies"
import MyUserReducer from "../reducers/MyUserReducer";

export const AppContext = createContext();

const initCurrentUser = () => {
    const currentUser = cookie.load('current-user');
    return currentUser ? currentUser : null;
}

export const AppProvider = ({ children }) => {
    // console.info('AppProvider')
    // console.info(JSON.stringify(initUser(), null, 2))
    // console.log(document.cookie);
    const [currentUser, currentUserDispatch] = useReducer(MyUserReducer, null, initCurrentUser);

    // console.info(JSON.stringify(token, null, 2))
    // console.info(JSON.stringify(currentUser, null, 2))

    const contextValue = {
        currentUser,
        currentUserDispatch,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
}