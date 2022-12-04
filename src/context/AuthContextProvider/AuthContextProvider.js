import React, { useEffect, useState } from 'react';
import { createContext } from 'react';
import useCookie from '../../hooks/useCookie';

export const UserContext = createContext();

const AuthContextProvider = ({ children }) => {

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const { cookies, removeCookie } = useCookie();

    const logOutHandler = () => {
        removeCookie('jwt_token');
        removeCookie('auth_key');
        setUser(null);
    }

    useEffect(() => {
        if (cookies?.jwt_token && cookies?.auth_key) {
            fetch(`http://localhost:5000/user`, {
                method: 'GET',
                headers: {
                    authorization: `bearer ${cookies?.jwt_token}`,
                    auth_key: cookies?.auth_key,
                }
            })
                .then(res => res.json())
                .then(data => {
                    setLoading(false);
                    setUser(data);
                })
                .catch((err) => {
                    setLoading(false);
                    const statusCode = err?.status;
                    if (statusCode === 403) {
                        logOutHandler();
                    }
                });
        } else {
            setLoading(false);
        }
    }, []);

    const userInfo = { user, setUser, loading, logOut: logOutHandler };

    return (
        <UserContext.Provider value={userInfo}>
            {children}
        </UserContext.Provider>
    );
}

export default AuthContextProvider;
