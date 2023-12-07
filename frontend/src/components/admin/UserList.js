import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import MetaData from '../layouts/MetaData'
import Sidebar from './Sidebar'
import Loader from '../layouts/Loader'
import { MDBDataTable } from 'mdbreact'
import { deleteUser, getUsers } from '../../actions/userActions'
import { clearError, clearUserDeleted } from '../../slices/userSlice'

export default function UserList() {
    const { users = [], loading = true, error, isUserDeleted } = useSelector((state) => state.userState)
console.log(users);
    const dispatch = useDispatch()
    // const navigate = useNavigate()


    const setUsers = () => {
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
                    label: 'Email',
                    field: 'email',
                    sort: 'asc'
                },
                {
                    label: 'Role',
                    field: 'role',
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
        users.forEach(user => {
            data.rows.push({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                actions:
                    <>
                        <Link to={`/admin/user/${user._id}`} className='btn btn-primary'>
                            <i className='fa fa-pencil'></i>
                        </Link>
                        <button
                            className='btn btn-danger py-1 px-2 ml-2'
                            onClick={(e) => {
                                if (window.confirm('Are you sure you want to delete this user?')) {
                                    deleteHandler(e, user._id);
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
        dispatch(deleteUser(id))
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
        if (isUserDeleted) {
            toast('User Deleted Successfully!', {
                type: 'success',
                position: toast.POSITION.BOTTOM_CENTER,
                onOpen: () => dispatch(clearUserDeleted())
            })
            return;
        }
        dispatch(getUsers)
    }, [dispatch, error, isUserDeleted])

    return (
        <>
            <MetaData title={'Users List'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <h1 className="my-4">Users List</h1>
                    <Fragment>
                        {loading ? <Loader /> :
                            <MDBDataTable
                                className='px-3'
                                bordered
                                striped
                                hover
                                data={setUsers()}
                            />}
                    </Fragment>

                </div>
            </div>
        </>
    )
}
