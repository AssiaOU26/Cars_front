import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        // If a token exists, try to validate it and get user data
        if (token) {
            // In a real app, you'd verify the token with the backend.
            // For now, we'll decode it to get the user data.
            try {
                const userData = JSON.parse(atob(token.split('.')[1]));
                setUser(userData);
            } catch (e) {
                console.error("Invalid token:", e);
                localStorage.removeItem('token');
                setToken(null);
            }
        }
    }, [token]);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = () => {
    return useContext(AuthContext);
};