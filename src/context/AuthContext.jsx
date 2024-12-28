// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser ] = useState(null);
    const [accessTokens, setAccessTokens] = useState([]);

    const login = (userData, tokens) => {
        setUser (userData);
        setAccessTokens(tokens);
    };

    const logout = () => {
        setUser (null);
        setAccessTokens([]);
    };

    return (
        <AuthContext.Provider value={{ user, accessTokens, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => {
    return useContext(AuthContext);
};