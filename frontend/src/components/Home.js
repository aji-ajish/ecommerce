import React, { Fragment, useEffect, useState } from 'react'
import MetaData from './layouts/MetaData'
import { getProducts } from '../actions/productActions'
import { useDispatch, useSelector } from 'react-redux'
import Loader from './layouts/Loader';
import Product from './product/Product';
import { toast } from 'react-toastify';
import Pagination from 'react-js-pagination'


export default function Home() {
    const dispatch = useDispatch();
    const { products, loading, error, productsCount, resultPerPage } = useSelector((state) => state.productsState)
    const [currentPage, setCurrentPage] = useState(1)

    const setCurrentPageNo = (pageNo) => {
        setCurrentPage(pageNo)
    }

    useEffect(() => {
        if (error) {
            return toast.error(error, {
                position: toast.POSITION.BOTTOM_RIGHT
            })
        }

        dispatch(getProducts(currentPage))
    }, [dispatch, error, currentPage])


    return (
        <Fragment>
            {loading ?
                <Loader /> :
                <Fragment>
                    <MetaData title={'Buy Best Products'} />
                    <h1 id="products_heading">Latest Products</h1>

                    <section id="products" className="container mt-5">
                        <div className="row">
                            {products && products.map(product => (
                                <Product product={product} key={product._id} col={4}/>
                            ))}
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
