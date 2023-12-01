import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import Pagination from 'react-js-pagination'
import Loader from '../layouts/Loader';
import MetaData from '../layouts/MetaData';
import Product from './Product';
import { useParams } from 'react-router-dom';
import { getProducts } from '../../actions/productActions';
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip'
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css'



export default function ProductSearch() {
    const dispatch = useDispatch();
    const { keyword } = useParams()
    const { products, loading, error, productsCount, resultPerPage } = useSelector((state) => state.productsState)
    const [currentPage, setCurrentPage] = useState(1)
    const [price, setPrice] = useState([1, 1000])
    const [category, setCategory] = useState(null)
    const [rating, setRating] = useState(0)
    const categories = [
        "Electronics",
        "Headphones",
        "Mobile Phones",
        "Laptops",
        "Accessories",
        "Food",
        "Books",
        "Clothes/Shoes",
        "Beauty/Health",
        "Sports",
        "Outdoor",
        "Home"
    ]

    const setCurrentPageNo = (pageNo) => {
        setCurrentPage(pageNo)
    }

    useEffect(() => {
        if (error) {
            return toast.error(error, {
                position: toast.POSITION.BOTTOM_RIGHT
            })
        }

        dispatch(getProducts(null, keyword, price, category, rating, currentPage))
    }, [dispatch, error, currentPage, keyword, price, category, rating])


    return (
        <Fragment>
            {loading ?
                <Loader /> :
                <Fragment>
                    <MetaData title={`Search - ${keyword} `} />
                    <h1 id="products_heading">Search Products</h1>

                    <section id="products" className="container mt-5">
                        <div className="row">
                            <div className='col-6 col-md-3 mb-5 mt-5'>
                                {/* price filter */}
                                <h4 className='mb-3'>Price</h4>
                                <div className='mx-3'>
                                    <Slider
                                        range={true}
                                        marks={{
                                            1: "$1",
                                            1000: "$1000"
                                        }}
                                        min={1}
                                        max={1000}
                                        defaultValue={price}
                                        onChangeComplete={(price) => {
                                            setPrice(price)
                                        }}
                                        handleRender={
                                            renderProps => {
                                                return (
                                                    <Tooltip overlay={`$${renderProps.props['aria-valuenow']}`}>
                                                        <div {...renderProps.props}></div>
                                                    </Tooltip>
                                                )
                                            }
                                        }
                                    />
                                </div>
                                <hr className='my-5 mb-3' />
                                {/* category filter */}
                                <div className='mt-0'>
                                    <h4 className='mb-3'>Category</h4>
                                    <ul className='pl-0'>
                                        {categories.map(category =>
                                            <li style={{
                                                cursor: 'pointer',
                                                listStyleType: 'none',
                                                marginBottom: '5px'
                                            }}
                                                key={category}
                                                onClick={() => setCategory(category)}>
                                                {category}
                                            </li>
                                        )}

                                    </ul>
                                </div>
                                <hr className='my-3' />
                                {/* ratings filter */}
                                <div className='mt-3'>
                                    <h4 className='mb-3'>Ratings</h4>
                                    <ul className='pl-0'>
                                        {[5, 4, 3, 2, 1].map(star =>
                                            <li style={{
                                                cursor: 'pointer',
                                                listStyleType: 'none',
                                                marginBottom: '5px'
                                            }}
                                                key={star}
                                                onClick={() => setRating(star)}>
                                                <div className='rating-outer'>
                                                <div className="rating-inner" 
                                                style={{ width: `${star * 20}%` }}></div>
                                                </div>
                                            </li>
                                        )}

                                    </ul>
                                </div>
                            </div>
                            <div className='col-6 col-md-9'>
                                <div className='row'>
                                    {products && products.map(product => (
                                        <Product product={product} key={product._id} col={4} />
                                    ))}
                                </div>
                            </div>

                        </div>
                    </section>
                    {productsCount > 0 && productsCount > resultPerPage ?
                        <div className='d-flex justify-content-center mt-5 '>
                            <Pagination
                                activePage={currentPage}
                                onChange={setCurrentPageNo}
                                totalItemsCount={productsCount}
                                itemsCountPerPage={resultPerPage}
                                nextPageText={'>'}
                                prevPageText={'<'}
                                firstPageText={'<<'}
                                lastPageText={'>>'}
                                itemClass={'page-item'}
                                linkClass={'page-link'}
                            />
                        </div> : null}
                </Fragment>
            }
        </Fragment>
    )
}
