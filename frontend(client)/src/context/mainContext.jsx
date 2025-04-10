import React, { createContext, useState } from 'react';


const MainContext = createContext();

export const MainProvider = ({ children }) => {
    const [currentUserID, setCurrentUserID] = useState(null);
    const [loading, setLoading] = useState(true);

    const [cart, setCart] = useState([]);
    

    const value = {
        currentUserID,
        setCurrentUserID,
        loading,
        setLoading,
    }
    
    return (
        <MainContext.Provider value={value}>
        {children}
        </MainContext.Provider>
    );
}

export const useMainContext = () => {
    return useContext(MainContext);
}