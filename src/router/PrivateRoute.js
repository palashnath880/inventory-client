import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/AuthContextProvider/AuthContextProvider';

const PrivateRoute = ({ children }) => {
    const { user } = useContext(UserContext);

    if (user !== null) {
        return <>{children}</>
    }

    return <Navigate to='/login' />
}

export default PrivateRoute;