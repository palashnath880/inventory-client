import React, { useContext, useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { UserContext } from '../../context/AuthContextProvider/AuthContextProvider';
import useCookie from '../../hooks/useCookie';
import axios from 'axios';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { useForm } from 'react-hook-form';

const Products = () => {

    const { user } = useContext(UserContext);
    const [category, setCategory] = useState(0);
    const [editModal, setEditModal] = useState(null);
    const { cookies } = useCookie();
    const { handleSubmit, register, formState: { errors }, reset } = useForm();

    // fetch categories
    const { data: categories = [] } = useQuery({
        queryKey: ['categories', category],
        queryFn: async () => {
            const res = await fetch(`http://localhost:5000/categories`);
            const data = await res.json();
            return data;
        }
    });

    // fetch products

    const { data: products = [], refetch, isLoading } = useQuery({
        queryKey: ['products', category],
        queryFn: async () => {
            const res = await fetch(`http://localhost:5000/products/${category}`, {
                headers: {
                    authorization: `bearer ${cookies?.jwt_token}`,
                    author_id: user?._id
                }
            });
            const data = await res.json();
            return data;
        }
    });

    // delete product
    const deleteProduct = (id) => {
        axios.delete(`http://localhost:5000/products/${id}`, {
            headers: {
                authorization: `bearer ${cookies?.jwt_token}`,
            },
        })
            .then(() => {
                toast.success('Product delete successfully.');
                refetch();
            });
    }

    //edit product 
    const editProduct = (data) => {
        axios.patch(`http://localhost:5000/products/${editModal?._id}`, data, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `bearer ${cookies?.jwt_token}`
            }
        })
            .then(res => {
                toast.success('Product updated successfully.');
                refetch();
                reset();
                setEditModal(null);
                console.log(res);
            });
    }

    // options for filter product by category
    const options = categories.map(category => {
        return { value: category?._id, label: category?.categoryName };
    });

    return (
        <div>
            <div className='my-5'>
                <h1 className='border-b pb-3 text-center text-2xl mb-2 border-gray-300'>Products</h1>
                <Link className='btn btn-primary' to='/products/add-product'>Add Products</Link>
            </div>
            {!isLoading && <div className="overflow-x-auto min-h-[330px]">
                <div className='w-52 ml-auto'>
                    <Select
                        options={options}
                        placeholder='Select Category'
                        isClearable={true}
                        onChange={(e) => e ? setCategory(e.value) : setCategory(0)}
                    />
                </div>
                {(products.length > 0 ?
                    <table className="table w-full mt-3">
                        <thead className=''>
                            <tr className='bg-base-100'>
                                <th></th>
                                <th>Product Name</th>
                                <th>Item Code</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Category</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) =>
                                <tr key={product?._id}>
                                    <th className='py-1'>{index + 1}</th>
                                    <td className='py-1'>{product?.productName}</td>
                                    <td className='py-1'>{product?.itemCode}</td>
                                    <td className='py-1'>{product?.productPrice}</td>
                                    <td className='py-1'>{product?.quantity}</td>
                                    <td className='py-1'>{product?.category?.categoryName}</td>
                                    <td className='py-1'>
                                        <div className='flex'>
                                            <label onClick={() => setEditModal(product)} htmlFor='productModal' className='p-3 cursor-pointer rounded-full hover:text-slate-50 hover:bg-violet-500 duration-300 mr-2'>
                                                <PencilIcon className='w-5 h-5' />
                                            </label>
                                            <button onClick={() => deleteProduct(product?._id)} htmlFor="categoryDeleteModal" className='p-3 cursor-pointer rounded-full text-red-500 hover:bg-red-200 duration-300'>
                                                <TrashIcon className='w-5 h-5' />
                                            </button>
                                        </div>
                                    </td>
                                </tr>)}

                        </tbody>
                    </table> : <p className='text-center mt-3 py-3 rounded-md bg-red-100 text-lg text-red-500'>Not Found</p>)
                }
            </div>
            }
            {/* Product edit modal */}
            {editModal && <>
                <input type="checkbox" id="productModal" className="modal-toggle" />
                <div className="modal">
                    <div className="modal-box relative">
                        <label
                            htmlFor='productModal'
                            onClick={() => {
                                setEditModal(null);
                                reset();
                            }}
                            className="btn btn-sm btn-circle absolute right-2 top-2"
                        >✕</label>
                        <h3 className="text-lg font-bold text-center pb-3 border-b">Edit Product</h3>
                        <div className='mt-3 text-center'>
                            <form onSubmit={handleSubmit(editProduct)}>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Product Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Product Name"
                                        className="input input-bordered"
                                        defaultValue={editModal?.productName}
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
                                        defaultValue={editModal?.productPrice}
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
                                        defaultValue={editModal?.itemCode}
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
                                        defaultValue={editModal?.quantity}
                                    />
                                    {errors?.quantity && <small className='text-red-500'>{errors?.quantity?.message}</small>}
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Category</span>
                                    </label>
                                    <select
                                        className="select select-bordered w-full"
                                        {...register('categoryId')}
                                    >
                                        {options.map(category =>
                                            <option
                                                key={category?.value}
                                                selected={category?.value == editModal.categoryId ? true : false}
                                                value={category?.value}
                                            >
                                                {category?.label}
                                            </option>
                                        )}
                                    </select>
                                </div>

                                <div className="form-control mt-6">
                                    <button type='submit' className="btn btn-primary">Update Category</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </>}
        </div>
    );
}

export default Products;
