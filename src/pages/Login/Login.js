import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/AuthContextProvider/AuthContextProvider';
import useCookie from '../../hooks/useCookie';

const Login = () => {

    const [error, setError] = useState('');
    const [resetError, setResetError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [confirmationData, setConfirmationData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { setCookie } = useCookie(['jwt_token', 'auth_key']);
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    // user login
    const handleLogin = (data) => {
        setLoading(true);
        setError('');
        axios.post(`http://localhost:5000/login`, data)
            .then(res => {
                setLoading(false);
                if (res?.data?.status === 'bad') {
                    setError(res?.data?.message);
                } else {
                    setCookie('jwt_token', res?.data?.token);
                    setCookie('auth_key', res?.data?.user?.authKey);
                    setUser(res?.data?.user);
                    reset();
                    toast.success('Login Successfully');
                    navigate('/');
                }
            })
            .catch(err => console.error(err));
    }

    // create a random code 
    const randomCode = () => {
        const str = "1234567890ABCDEFGHIJKLMNOPQRSTWXYZ";
        let random = '';
        for (let i = 0; i < 6; i++) {
            const index = Math.floor(Math.random() * str.length);
            random += str[index];
        }
        return random;
    }

    // reset password send code 
    const handleResetPassword = (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const code = randomCode();
        const url = `http://localhost:5000/reset-password/${email}/${code}`;
        axios.get(url)
            .then((res) => {
                if (res?.data?.status == 'bad') {
                    setResetError(res?.data?.message);
                } else {
                    setConfirmationData({ email, code });
                    toast.success('Confirmation Code Send Your Email.');
                }
            });
    }

    // confirm reset passoword
    const confirmResetPassword = (e) => {
        e.preventDefault();
        const form = e.target;
        const password = form.password.value;
        const url = `http://localhost:5000/reset-password`;
        axios.post(url, { email: confirmationData?.email, password })
            .then(() => {
                setConfirmationData(null);
                setModalOpen(false);
                toast.success('Your Password Update Successfully.');
            });
    }

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content min-w-[400px]">
                <div className="card flex-shrink-0 w-full shadow-2xl bg-base-100">
                    <form className="card-body p-5" onSubmit={handleSubmit(handleLogin)}>
                        <h1 className="text-3xl font-bold text-center">Login now!</h1>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="email"
                                className="input input-bordered"
                                {...register('email', { required: 'Enter Your Email' })}
                            />
                            {errors?.email && <small className='text-red-500'>{errors?.email?.message}</small>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="password"
                                className="input input-bordered"
                                {...register('password', { required: 'Enter Your Password' })}
                            />
                            {errors?.password && <small className='text-red-500'>{errors?.password?.message}</small>}
                            <label className="mt-2" htmlFor="passwordResetModal" onClick={() => setModalOpen(true)}>
                                <span className="label-text-alt link link-hover">Forgot password?</span>
                            </label>
                        </div>
                        {error && <p className='text-red-500 text-center'>{error}</p>}
                        <div className="form-control mt-3">
                            <button disabled={loading} type='submit' className="btn btn-primary">Login</button>
                        </div>
                        <p className='text-center'><small>Don't have an account. Please <Link to='/register' className='underline '>Register</Link></small></p>
                    </form>
                </div>
            </div>

            {/* password reset modal */}
            {modalOpen && <>
                <input type="checkbox" id="passwordResetModal" className="modal-toggle" />
                <label htmlFor="passwordResetModal" className="modal cursor-pointer">
                    <label className="modal-box relative" htmlFor="">
                        <h3 className="text-lg font-bold text-center pb-3 border-b mb-3">Password Reset</h3>
                        {!confirmationData?.codeMatch &&
                            <form onSubmit={handleResetPassword}>
                                {confirmationData == null &&
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Email</span>
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="example@gmail.com"
                                            className="input input-bordered"
                                            name='email'
                                            required
                                        />
                                    </div>
                                }
                                {confirmationData !== null && (
                                    !confirmationData?.codeMatch &&
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Confirmation Code</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Confirmation Code"
                                            className="input input-bordered"
                                            name='code'
                                            onChange={(e) => {
                                                if (e.target.value.toUpperCase() == confirmationData?.code.toUpperCase()) {
                                                    setConfirmationData({ ...confirmationData, codeMatch: true });
                                                }
                                            }}
                                        />
                                    </div>
                                )}
                                {resetError && <p className='text-red-500 text-center'>{resetError}</p>}
                                {!confirmationData && <div className="form-control mt-6">
                                    <button className="btn btn-primary">Submit</button>
                                </div>}
                            </form>
                        }
                        {confirmationData?.codeMatch &&
                            <form onSubmit={confirmResetPassword}>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">New Password</span>
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="password"
                                        className="input input-bordered"
                                        name='password'
                                        required
                                    />
                                </div>
                                <div className="form-control mt-6">
                                    <button className="btn btn-primary">Update Password</button>
                                </div>
                            </form>
                        }
                    </label>
                </label></>}
        </div>
    );
}

export default Login;
