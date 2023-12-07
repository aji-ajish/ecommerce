import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { indianRupee } from '../../util/currencyFormate'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { clearError, clearOrderDeleted } from '../../slices/orderSlice'
import MetaData from '../layouts/MetaData'
import Sidebar from './Sidebar'
import Loader from '../layouts/Loader'
import { MDBDataTable } from 'mdbreact'
import { adminOrders as adminOrdersAction, deleteOrder } from '../../actions/orderActions'

export default function OrderList() {
    const { adminOrders = [], loading = true, error, isOrderDeleted } = useSelector((state) => state.orderState)

    const dispatch = useDispatch()
    // const navigate = useNavigate()


    const setOrders = () => {
        const data = {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Number of Items',
                    field: 'numberOfItems',
                    sort: 'asc'
                },
                {
                    label: 'Amount',
                    field: 'amount',
                    sort: 'asc'
                },
                {
                    label: 'Status',
                    field: 'status',
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
        adminOrders.forEach(order => {
            data.rows.push({
                id: order._id,
                numberOfItems: order.orderItems.length,
                amount: indianRupee(order.totalPrice),
                status: order.orderStatus && order.orderStatus.includes("Delivered") ?
                    (<p style={{ color: 'green' }}> {order.orderStatus} </p>) :
                    (<p style={{ color: 'red' }}> {order.orderStatus} </p>),
                actions:
                    <>
                        <Link to={`/admin/order/${order._id}`} className='btn btn-primary'>
                            <i className='fa fa-pencil'></i>
                        </Link>
                        <button
                            className='btn btn-danger py-1 px-2 ml-2'
                            onClick={(e) => {
                                if (window.confirm('Are you sure you want to delete this product?')) {
                                    deleteHandler(e, order._id);
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
        dispatch(deleteOrder(id))
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
        if (isOrderDeleted) {
            toast('Order Deleted Successfully!', {
                type: 'success',
                position: toast.POSITION.BOTTOM_CENTER,
                onOpen: () => dispatch(clearOrderDeleted())
            })
            return;
        }

        dispatch(adminOrdersAction)
    }, [dispatch, error, isOrderDeleted])

    return (
        <>
            <MetaData title={'Orders List'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <h1 className="my-4">Orders List</h1>
                    <Fragment>
                        {loading ? <Loader /> :
                            <MDBDataTable
                                className='px-3'
                                bordered
                                striped
                                hover
                                data={setOrders()}
                            />}
                    </Fragment>

                </div>
            </div>
        </>
    )
}
