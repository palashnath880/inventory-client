import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { UserContext } from '../../context/AuthContextProvider/AuthContextProvider';
import useCookie from '../../hooks/useCookie';
import toast from 'react-hot-toast';

const Register = () => {

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { setUser } = useContext(UserContext);
    const { setCookie } = useCookie();
    const navigate = useNavigate();

    const handleRegister = (data) => {
        const user = { ...data };
        user.registerDate = format(new Date(), 'PPpp');
        setLoading(true);
        axios.post('http://localhost:5000/register', user)
            .then(res => {
                setLoading(false);
                if (res?.data?.status === 'bad') {
                    setError(res?.data?.message);
                } else {
                    reset();
                    setCookie('jwt_token', res?.data?.token);
                    setCookie('auth_key', res?.data?.user?.authKey);
                    setUser(res?.data?.user);
                    navigate('/');
                }
            })
            .catch(err => console.error(err));
    }

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content w-[420px] max-w-full">
                <div className="card flex-shrink-0 w-full shadow-2xl bg-base-100">
                    <form className="card-body p-5" onSubmit={handleSubmit(handleRegister)}>
                        <h1 className="text-3xl font-bold text-center">Register now!</h1>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Full Name</span>
                            </label>
                            <input
                                type="text"
                                placeholder="full name"
                                className="input input-bordered"
                                {...register('name', { required: 'Please Enter Name' })}
                            />
                            {errors?.name && <small className='text-red-500'>{errors.name?.message}</small>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Mobile</span>
                            </label>
                            <input
                                type="tel"
                                placeholder="mobile"
                                className="input input-bordered"
                                {...register('mobile', { required: 'Please Enter Mobile Number' })}
                            />
                            {errors?.mobile && <small className='text-red-500'>{errors.mobile?.message}</small>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="email"
                                className="input input-bordered"
                                {...register('email', { required: 'Please Enter Email' })}
                            />
                            {errors?.email && <small className='text-red-500'>{errors.email?.message}</small>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="password"
                                className="input input-bordered"
                                {...register('password', {
                                    pattern: /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{6,20}$/,
                                    required: 'Password more than 6 characters, at least 1 uppercase and lowercase, and at least 1 number and a special character'
                                })}
                            />
                            {errors?.password && <small className='text-red-500'>{errors.password?.message}</small>}
                        </div>
                        {error && <p className='text-red-500 text-center'>{error}</p>}
                        <div className="form-control mt-3">
                            <button disabled={loading} className="btn btn-primary">Register</button>
                        </div>
                        <p className='text-center'><small>Already have an account. Please <Link to='/login' className='underline'>login</Link></small></p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
