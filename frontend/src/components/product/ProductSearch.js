import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import Pagination from 'react-js-pagination'
import Loader from '../layouts/Loader';
import MetaData from '../layouts/MetaData';
import Product from './Product';
import { useParams } from 'react-router-dom';
import { getProducts } from '../../actions/productsActions';



export default function ProductSearch() {
    const dispatch = useDispatch();
    const { keyword } = useParams()
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

        dispatch(getProducts(null,keyword, currentPage))
    }, [dispatch, error, currentPage, keyword])


    return (
        <Fragment>
            {loading ?
                <Loader /> :
                <Fragment>
                    <MetaData title={`Search - ${keyword} `} />
                    <h1 id="products_heading">Search Products</h1>

                    <section id="products" className="container mt-5">
                        <div className="row">
                            {products && products.map(product => (
                                <Product product={product} key={product._id} />
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
