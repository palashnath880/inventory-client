import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/AuthContextProvider/AuthContextProvider';

const AuthRoute = ({ children }) => {
    const { user } = useContext(UserContext);

    if (user === null) {
        return <>{children}</>
    }

    return <Navigate to='/' />
}

export default AuthRoute;
