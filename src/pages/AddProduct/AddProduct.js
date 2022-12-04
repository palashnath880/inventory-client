import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Select from 'react-select';
import axios from 'axios';
import { format } from 'date-fns';
import useCookie from '../../hooks/useCookie';
import { UserContext } from '../../context/AuthContextProvider/AuthContextProvider';
import toast from 'react-hot-toast';

const AddProduct = () => {

    const [error, setError] = useState('');
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const { cookies } = useCookie();
    const { user } = useContext(UserContext);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const navigate = useNavigate();

    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await fetch(`http://localhost:5000/categories`);
            const data = await res.json();
            return data;
        }
    });

    const options = categories.map(category => {
        return { value: category?._id, label: category?.categoryName };
    });

    const handleAddProduct = (data) => {
        const product = { ...data };
        product.categoryId = category;
        product.date = format(new Date(), 'PPpp');
        product.authorId = user?._id;
        setLoading(true);
        if (!category) {
            toast.error('Please select category');
            return;
        }
        axios.post(`http://localhost:5000/products`, product, {
            headers: {
                authorization: `bearer ${cookies?.jwt_token}`
            }
        })
            .then(() => {
                setLoading(false);
                toast.success('Product added successfully.');
                reset();
                navigate('/products');
            });
    }
    return (
        <div>
            <div className=''>
                <div>
                    <h3 className='border-b pb-3 text-center text-2xl'>Add Product</h3>
                    <Link to='/products' className='p-2 rounded-full mt-2 inline-block hover:bg-gray-300 duration-300'><ArrowLeftIcon className='w-5 h-5' /></Link>
                </div>
                <div className='md:w-8/12 lg:w-7/12 md:mx-auto border border-gray-300 shadow-lg p-2 rounded-md '>
                    <form className='pb-3' onSubmit={handleSubmit(handleAddProduct)}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Product Name</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Product Name"
                                className="input input-bordered"
                                {...register('productName', { required: 'Enter Product Name' })}
                            />
                            {errors?.productName && <small className='text-red-500'>{errors?.productName?.message}</small>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Product Price</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Product Price"
                                className="input input-bordered"
                                {...register('productPrice', { required: 'Enter Product Price' })}
                            />
                            {errors?.productPrice && <small className='text-red-500'>{errors?.productPrice?.message}</small>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Item Code</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Item Code"
                                className="input input-bordered"
                                {...register('itemCode', { required: 'Enter Item Code' })}
                            />
                            {errors?.itemCode && <small className='text-red-500'>{errors?.itemCode?.message}</small>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Quantity</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Product Quantity"
                                className="input input-bordered"
                                {...register('quantity', { required: 'Enter Product Quantity' })}
                            />
                            {errors?.quantity && <small className='text-red-500'>{errors?.quantity?.message}</small>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Category</span>
                            </label>
                            <Select
                                options={options}
                                onChange={(e) => setCategory(e?.value)}
                                placeholder='Select Category'
                                required
                            />
                        </div>
                        {error && <p className='text-red-500 text-center'>{error}</p>}
                        <div className="form-control mt-6">
                            <button disabled={loading} className="btn btn-primary">Add Product</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddProduct;
