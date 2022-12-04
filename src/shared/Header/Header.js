import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/AuthContextProvider/AuthContextProvider';
import avatar from '../../images/user.png';
import { Bars3Icon } from '@heroicons/react/24/outline';

const Header = () => {
    const { logOut, user } = useContext(UserContext);
    return (
        <header className='border-b'>
            <div className='container mx-auto px-5'>
                <div className="navbar bg-base-100">
                    <div className=' flex-1 lg:hidden'>
                        <label htmlFor="drawer" className="lg:hidden cursor-pointer">
                            <Bars3Icon className='w-6 h-6' />
                        </label>
                    </div>
                    <div className="flex-1 hidden lg:block">
                        <a className="text-xl">Inventory</a>
                    </div>
                    <div className="flex-none">
                        <div className="dropdown dropdown-end" title={user?.displayName}>
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img src={user?.photoUrl || avatar} />
                                </div>
                            </label>
                            <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                                <li>
                                    <Link to='/profile'>Profile</Link>
                                </li>
                                <li><button onClick={logOut}>Logout</button></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
