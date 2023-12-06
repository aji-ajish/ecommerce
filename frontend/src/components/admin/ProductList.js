import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { indianRupee } from '../../util/currencyFormate'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { clearError } from '../../slices/productsSlice'
import { getAdminProducts } from '../../actions/productActions'
import MetaData from '../layouts/MetaData'
import Sidebar from './Sidebar'
import Loader from '../layouts/Loader'
import { MDBDataTable } from 'mdbreact'

export default function ProductList() {
    const { products = [], loading = true, error } = useSelector((state) => state.productsState)
    const dispatch = useDispatch()

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
                        <button className='btn btn-danger py-1 px-2 ml-2'><i className='fa fa-trash'></i></button>
                    </>
            })
        });
        return data
    }

    useEffect(() => {
        if (error) {
            toast(error, {
                type: 'error',
                position: toast.POSITION.BOTTOM_CENTER,
                onOpen: () => { dispatch(clearError()) }
            })
            return
        }
        dispatch(getAdminProducts)
    }, [dispatch, error])

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
