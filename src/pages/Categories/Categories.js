import React, { useState } from 'react';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useCookie from '../../hooks/useCookie';
import toast from 'react-hot-toast';

const Categories = () => {

    const [editModal, setEditModal] = useState(null);
    const [loading, setLoading] = useState(false);
    const { cookies } = useCookie();

    const { data: categories = [], refetch, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await fetch(`http://localhost:5000/categories`);
            const data = await res.json();
            return data;
        }
    });

    const handleDeleteCategory = (id) => {
        axios.delete(`http://localhost:5000/categories/${id}`, {
            headers: {
                authorization: `bearer ${cookies?.jwt_token}`
            }
        })
            .then(() => {
                refetch();
                toast.success('Category deleted successfully');
            })
    }

    const handleEditCategory = (event) => {
        event.preventDefault();
        const form = event.target;
        const category = form.category.value;
        setLoading(true);
        axios.patch(`http://localhost:5000/categories/${editModal?._id}`, { categoryName: category }, {
            headers: {
                authorization: `bearer ${cookies?.jwt_token}`
            }
        })
            .then(() => {
                setLoading(false);
                setEditModal(null);
                refetch();
                toast.success('Category updated successfully');
            })
    }

    return (
        <div>
            <div className='my-5'>
                <h1 className='border-b pb-3 text-center text-2xl mb-2 border-gray-300'>Categories</h1>
                <Link to='/categories/add-category' className='btn btn-primary'>Add Category</Link>
            </div>
            {!isLoading && <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead className=''>
                        <tr className='bg-base-100'>
                            <th></th>
                            <th>Category Name</th>
                            <th>Create Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category, index) =>
                            <tr key={category?._id}>
                                <th className='py-1'>{index + 1}</th>
                                <td className='py-1'>{category?.categoryName}</td>
                                <td className='py-1'>{category?.createDate}</td>
                                <td className='py-1'>
                                    <div className='flex'>
                                        <label onClick={() => setEditModal(category)} htmlFor='categoryEditModal' className='p-3 cursor-pointer rounded-full hover:text-slate-50 hover:bg-violet-500 duration-300 mr-2'>
                                            <PencilIcon className='w-5 h-5' />
                                        </label>
                                        <button onClick={() => handleDeleteCategory(category?._id)} className='p-3 cursor-pointer rounded-full text-red-500 hover:bg-red-200 duration-300'>
                                            <TrashIcon className='w-5 h-5' />
                                        </button>
                                    </div>
                                </td>
                            </tr>)}
                    </tbody>
                </table>
            </div>}

            {/* Category edit modal */}
            {editModal && <>
                <input type="checkbox" id="categoryEditModal" className="modal-toggle" />
                <div className="modal">
                    <div className="modal-box relative">
                        <label htmlFor="categoryEditModal" onClick={() => setEditModal(null)} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                        <h3 className="text-lg font-bold text-center pb-3 border-b">Edit Category</h3>
                        <div className='mt-3 text-center'>
                            <form onSubmit={handleEditCategory}>
                                <div className="form-control">
                                    <input
                                        type="text"
                                        placeholder="category"
                                        className="input input-bordered"
                                        name='category'
                                        defaultValue={editModal?.categoryName}
                                        required
                                    />
                                </div>

                                <div className="form-control mt-6">
                                    <button disabled={loading} type='submit' className="btn btn-primary">Update Category</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </>}

        </div>
    );
}

export default Categories;
