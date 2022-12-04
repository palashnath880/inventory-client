import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Header from '../../shared/Header/Header';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const DashboardLayout = () => {

    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <Header />
            <div className="drawer drawer-mobile min-h-screen h-auto bg-base-200">
                <input id="drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    <div className='p-3'>
                        <Outlet />
                    </div>
                </div>
                <div className="drawer-side">
                    <label htmlFor="drawer" className="drawer-overlay"></label>
                    <ul className="menu p-4 w-80 bg-base-100 text-base-content">
                        <li className='mb-1'><NavLink className='py-2 border-b font-semibold' to='/categories'>Categories</NavLink></li>
                        <li className='mb-1'><NavLink className='py-2 border-b font-semibold' to='/products'>Products</NavLink></li>
                    </ul>
                </div>
            </div>
        </QueryClientProvider>
    );
}

export default DashboardLayout;
