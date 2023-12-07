import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import MetaData from '../layouts/MetaData'
import Sidebar from './Sidebar'
import Loader from '../layouts/Loader'
import { MDBDataTable } from 'mdbreact'
import { deleteReview, getReviews } from '../../actions/productActions'
import { clearError, clearReviewDeleted } from '../../slices/productSlice'

export default function ReviewList() {
    const { reviews = [], loading = true, error, isReviewDeleted } = useSelector((state) => state.productState)
    const [productId, setProductId] = useState('')


    const dispatch = useDispatch()


    const setReviews = () => {
        const data = {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Rating',
                    field: 'rating',
                    sort: 'asc'
                },
                {
                    label: 'User',
                    field: 'user',
                    sort: 'asc'
                },
                {
                    label: 'Comment',
                    field: 'comment',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    sort: 'asc'
                }
            ],
            rows: []
        }
        reviews.forEach(review => {
            data.rows.push({
                id: review._id,
                rating: review.rating,
                user: review.user.name,
                comment: review.comment,
                actions:
                    <>

                        <button
                            className='btn btn-danger py-1 px-2 ml-2'
                            onClick={(e) => {
                                if (window.confirm('Are you sure you want to delete this review?')) {
                                    deleteHandler(e, review._id);
                                }
                            }}
                        >
                            <i className='fa fa-trash'></i>
                        </button>

                    </>
            })
        });
        return data
    }

    const deleteHandler = (e, id) => {
        e.target.disabled = true;
        dispatch(deleteReview(productId, id))
    }

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(getReviews(productId))
    }

    useEffect(() => {
        if (error) {
            toast(error, {
                position: toast.POSITION.BOTTOM_CENTER,
                type: 'error',
                onOpen: () => { dispatch(clearError()) }
            })
            return
        }
        if (isReviewDeleted) {
            toast('Review Deleted Successfully!', {
                type: 'success',
                position: toast.POSITION.BOTTOM_CENTER,
                onOpen: () => dispatch(clearReviewDeleted())
            })
            dispatch(getReviews(productId))

            return;
        }
    }, [dispatch, error, isReviewDeleted])

    return (
        <>
            <MetaData title={'Reviews List'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <h1 className="my-4">Reviews List</h1>
                    <div className='row justify-content-center mt-5'>
                        <div className='col-5'>
                            <form onSubmit={submitHandler}>
                                <div className='form-group'>
                                    <label > Product Id</label>
                                    <input type='text' onChange={e => setProductId(e.target.value)} value={productId} className='form-control' />
                                </div>
                                <button type='submit' disabled={loading} className='btn btn-primary btn-block py-2'>Search Product Reviews</button>
                            </form>
                        </div>
                    </div>
                    <Fragment>
                        {loading ? <Loader /> :
                            <MDBDataTable
                                className='px-3'
                                bordered
                                striped
                                hover
                                data={setReviews()}
                            />}
                    </Fragment>

                </div>
            </div>
        </>
    )
}
