import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createReview, getProduct } from '../../actions/productActions'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import Loader from '../layouts/Loader';
import { Button, Carousel, Modal } from 'react-bootstrap'
import MetaData from '../layouts/MetaData';
import { addCartItem } from '../../actions/cartActions';
import { indianRupee } from '../../util/currencyFormate';
import { clearError, clearProduct, clearReviewSubmitted } from '../../slices/productSlice';
import ProductReview from './ProductReview';

export default function ProductDetail() {
    const dispatch = useDispatch()
    const { id } = useParams()
    const { product = {}, loading, error, isReviewSubmitted } = useSelector((state) => state.productState)
    const { user } = useSelector((state) => state.authState)
    const [quantity, setQuantity] = useState(1)
    const [show, setShow] = useState(false);
    const [rating, setRating] = useState(1)
    const [comment, setComment] = useState('')


    const increaseQty = () => {
        const count = Number(document.querySelector('.count').value)
        if (product.stock === 0 || count >= product.stock) return;

        const qty = count + 1
        setQuantity(qty)
    }
    const decreaseQty = () => {
        const count = Number(document.querySelector('.count').value)
        if (count === 1) return;
        const qty = count - 1
        setQuantity(qty)
    }


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true)

    const reviewHandler = () => {
        const formData = new FormData()
        formData.append('rating', rating)
        formData.append('comment', comment)
        formData.append('productId', id)

        dispatch(createReview(formData))
    }

    useEffect(() => {
        if (isReviewSubmitted) {
            handleClose()
            toast('Review Submitted successfully', {
                type: 'success',
                position: toast.POSITION.BOTTOM_CENTER,
                onOpen: () => dispatch(clearReviewSubmitted())
            })
        }
        if (error) {
            toast(error, {
                position: toast.POSITION.BOTTOM_CENTER,
                type: 'error',
                onOpen: () => { dispatch(clearError()) }
            })
            return
        }
        if (!product._id || isReviewSubmitted) {
            dispatch(getProduct(id))
        }
        return () => {
            dispatch(clearProduct())
        }
    }, [dispatch, id, isReviewSubmitted, error])

    return (
        <>
            {loading ?
                <Loader /> :
                <>
                    <MetaData title={product.name} />
                    <div className="row f-flex justify-content-around">
                        <div className="col-12 col-lg-5 img-fluid" id="product_image">
                            <Carousel pause="hover">
                                {product.images && product.images.map(image => (
                                    <Carousel.Item key={image._id}>
                                        <img src={image.image} alt={product.name} height="500" width="500" />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        </div>

                        <div className="col-12 col-lg-5 mt-5">
                            <h3>{product.name}</h3>
                            <p id="product_id">Product # {product._id}</p>

                            <hr />

                            <div className="rating-outer">
                                <div className="rating-inner" style={{ width: `${product.ratings / 5 * 100}%` }}></div>
                            </div>
                            <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>

                            <hr />

                            <p id="product_price">{indianRupee(product.price)}</p>
                            <div className="stockCounter d-inline">
                                {product.stock === 0 ? '' : <>
                                    <span className="btn btn-danger minus" onClick={decreaseQty}>-</span>

                                    <input type="text" className="form-control count d-inline" value={quantity} readOnly />

                                    <span className="btn btn-primary plus" onClick={increaseQty}>+</span>
                                </>}

                            </div>
                            <button type="button" id="cart_btn" className="btn btn-primary d-inline ml-4" onClick={() => dispatch(addCartItem(product._id, quantity))}
                                disabled={product.stock === 0 ? true : false}>
                                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</button>

                            <hr />

                            <p>Status: <span className={product.stock > 0 ? 'greenColor' : 'redColor'} id="stock_status">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></p>

                            <hr />

                            <h4 className="mt-2">Description:</h4>
                            <p>{product.description}</p>
                            <hr />
                            <p id="product_seller mb-3">Sold by: <strong>{product.seller}</strong></p>
                            {user ?
                                <Fragment>
                                    <button id="review_btn" type="button" className="btn btn-primary mt-4" data-toggle="modal"
                                        data-target="#ratingModal" onClick={handleShow}>
                                        Submit Your Review
                                    </button>

                                    <div className="row mt-2 mb-5">
                                        <div className="rating ">

                                            <Modal show={show} onHide={handleClose}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title>Submit Review</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>

                                                    <ul className="stars">
                                                        {[1, 2, 3, 4, 5].map(star => (
                                                            <li className={`star ${star <= rating ? 'orange' : ''}`} value={star} key={star}
                                                                onClick={() => setRating(star)}
                                                                onMouseOver={(e) => e.target.classList.add('yellow')}
                                                                onMouseOut={(e) => e.target.classList.remove('yellow')}>
                                                                <i className="fa fa-star"></i></li>
                                                        ))}

                                                    </ul>

                                                    <textarea name="review" id="review" className="form-control mt-3" value={comment} onChange={(e) => setComment(e.target.value)}>

                                                    </textarea>

                                                    <button disabled={loading} onClick={reviewHandler} className="btn my-3 float-right review-btn px-4 text-white"
                                                        data-dismiss="modal" aria-label="Close">Submit</button>
                                                </Modal.Body>
                                            </Modal>

                                        </div>

                                    </div>
                                </Fragment> :
                                <div className='alert alert-danger'>Login to Post Review</div>}

                        </div>
                        {product.reviews && product.reviews.length > 0 ?
                            <ProductReview reviews={product.reviews} /> : null}
                    </div>
                </>
            }
        </>
    )
}
