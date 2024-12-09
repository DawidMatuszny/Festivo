import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [message, setMessage] = useState(null);

    const notify = (msg) => setMessage(msg);
    const clearMessage = () => setMessage(null);

    return (
        <NotificationContext.Provider value={{ message, notify, clearMessage }}>
            {children}
        </NotificationContext.Provider>
    );
};
