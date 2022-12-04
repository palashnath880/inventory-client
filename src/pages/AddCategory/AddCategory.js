import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import useCookie from '../../hooks/useCookie';
import toast from 'react-hot-toast';
import { UserContext } from '../../context/AuthContextProvider/AuthContextProvider';

const AddCategory = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { cookies } = useCookie();
    const { logOut } = useContext(UserContext);

    const navigate = useNavigate();

    const handleCategory = (event) => {
        event.preventDefault();
        const form = event.target;
        const category = form.category.value;
        const categoryData = {
            categoryName: category,
            createDate: format(new Date(), 'PPpp'),
        };
        setLoading(true);
        setError('');
        fetch(`http://localhost:5000/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `bearer ${cookies?.jwt_token}`
            },
            body: JSON.stringify(categoryData)
        })
            .then(res => res.json())
            .then(data => {
                setLoading(false);
                if (data?.status === 'bad') {
                    setError(data?.message);
                } else {
                    toast.success('Category added successfully.');
                    navigate('/categories');
                }
            })
            .catch(err => {
                const statusCode = err.status;
                if (statusCode === 403) {
                    toast.error('Your token is expired. Please Login');
                    logOut();
                }
            });
    }

    return (
        <div>
            <div className=''>
                <div className='mt-5'>
                    <h3 className='border-b pb-3 text-center text-2xl'>Add Category</h3>
                    <Link to='/categories' className='p-2 rounded-full mt-2 inline-block hover:bg-gray-300 duration-300'><ArrowLeftIcon className='w-5 h-5' /></Link>
                </div>
                <div className='md:w-8/12 lg:w-7/12 md:mx-auto border border-gray-300 shadow-lg p-2 rounded-md mt-5'>
                    <form className='mt-3' onSubmit={handleCategory}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Category</span>
                            </label>
                            <input
                                type="text"
                                placeholder="category"
                                className="input input-bordered"
                                name='category'
                                required
                            />
                        </div>
                        {error && <p className='text-center'><small className='text-red-500'>{error}</small></p>}
                        <div className="form-control mt-6">
                            <button disabled={loading} type='submit' className="btn btn-primary">Add Category</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddCategory;
