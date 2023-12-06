import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { indianRupee } from '../../util/currencyFormate'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { clearError } from '../../slices/productsSlice'
import { clearError as productClearError } from '../../slices/productSlice'
import { deleteProduct, getAdminProducts } from '../../actions/productActions'
import MetaData from '../layouts/MetaData'
import Sidebar from './Sidebar'
import Loader from '../layouts/Loader'
import { MDBDataTable } from 'mdbreact'
import { clearProductDeleted } from '../../slices/productSlice'

export default function ProductList() {
    const { products = [], loading = true, error, } = useSelector((state) => state.productsState)
    const { isProductDeleted, error: productError } = useSelector((state) => state.productState)

    const dispatch = useDispatch()
    const navigate = useNavigate()


    const setProducts = () => {
        const data = {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc'
                },
                {
                    label: 'Price',
                    field: 'price',
                    sort: 'asc'
                },
                {
                    label: 'Stock',
                    field: 'stock',
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
        products.forEach(product => {
            data.rows.push({
                id: product._id,
                name: product.name,
                price: indianRupee(product.price),
                stock: product.stock,
                actions:
                    <>
                        <Link to={`/admin/product${product._id}`} className='btn btn-primary'>
                            <i className='fa fa-pencil'></i>
                        </Link>
                        <button
                            className='btn btn-danger py-1 px-2 ml-2'
                            onClick={(e) => {
                                if (window.confirm('Are you sure you want to delete this product?')) {
                                    deleteHandler(e, product._id);
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
        dispatch(deleteProduct(id))
    }

    useEffect(() => {
        if (error || productError) {
            toast(error || productError, {
                position: toast.POSITION.BOTTOM_CENTER,
                type: 'error',
                onOpen: () => { dispatch(clearError()) }
            })
            return
        }
        if (isProductDeleted) {
            toast('Product Deleted Succesfully!', {
                type: 'success',
                position: toast.POSITION.BOTTOM_CENTER,
                onOpen: () => dispatch(clearProductDeleted())
            })
            return;
        }

        dispatch(getAdminProducts)
    }, [dispatch, error, isProductDeleted])

    return (
        <>
            <MetaData title={'Product List'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <h1 className="my-4">Product List</h1>
                    <Fragment>
                        {loading ? <Loader /> :
                            <MDBDataTable
                                className='px-3'
                                bordered
                                striped
                                hover
                                data={setProducts()}
                            />}
                    </Fragment>

                </div>
            </div>
        </>
    )
}
