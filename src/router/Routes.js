import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout/DashboardLayout';
import AddCategory from '../pages/AddCategory/AddCategory';
import AddProduct from '../pages/AddProduct/AddProduct';
import Categories from '../pages/Categories/Categories';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Products from '../pages/Products/Products';
import Register from '../pages/Register/Register';
import AuthRoute from './AuthRoute';
import PrivateRoute from './PrivateRoute';

const Routes = () => {

    const router = createBrowserRouter([
        {
            path: '/',
            element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
            children: [
                {
                    path: '/',
                    element: <PrivateRoute><Home /></PrivateRoute>
                },
                {
                    path: '/categories',
                    children: [
                        {
                            path: '/categories',
                            element: <PrivateRoute><Categories /></PrivateRoute>
                        },
                        {
                            path: '/categories/add-category',
                            element: <PrivateRoute><AddCategory /></PrivateRoute>
                        }
                    ]
                },
                {
                    path: '/products',
                    children: [
                        {
                            path: '/products',
                            element: <PrivateRoute><Products /></PrivateRoute>,
                        },
                        {
                            path: '/products/add-product',
                            element: <PrivateRoute><AddProduct /></PrivateRoute>
                        }
                    ]
                }
            ]
        },
        {
            path: '/login',
            element: <AuthRoute><Login /></AuthRoute>
        },
        {
            path: '/register',
            element: <AuthRoute><Register /></AuthRoute>
        }
    ]);

    return (
        <RouterProvider router={router}></RouterProvider>
    );
}

export default Routes;
