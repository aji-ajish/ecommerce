import React, { useEffect, useState } from 'react'
import MetaData from '../layouts/MetaData'
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUser, updateUser } from '../../actions/userActions';
import { clearError, clearUserUpdated } from '../../slices/userSlice';

export default function UpdateUser() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');

    const { loading = true, error, isUserUpdated, user = {} } = useSelector((state) => state.userState)
    const { user: authUser } = useSelector((state) => state.authState)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id: userId } = useParams()



    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('role', role);
        dispatch(updateUser(userId, formData))
    }



    useEffect(() => {
        if (isUserUpdated) {
            toast('User Updated Successfully !', {
                type: 'success',
                position: toast.POSITION.BOTTOM_CENTER,
                onOpen: () => dispatch(clearUserUpdated())
            })
            return;
        }

        if (error) {
            toast(error, {
                position: toast.POSITION.BOTTOM_CENTER,
                type: 'error',
                onOpen: () => { dispatch(clearError()) }
            })
            return
        }
        dispatch(getUser(userId))
    }, [isUserUpdated, error, dispatch])

    useEffect(() => {
        if (user._id) {
            setName(user.name)
            setEmail(user.email)
            setRole(user.role)

        }
    }, [user])

    return (
        <>
            <MetaData title={'User Update'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <div className="wrapper my-5">
                        <form onSubmit={submitHandler} className="shadow-lg" encType='multipart/form-data'>
                            <h1 className="mb-4">Update User</h1>

                            <div className="form-group">
                                <label htmlFor="name_field">Name</label>
                                <input
                                    type="text"
                                    id="name_field"
                                    className="form-control"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email_field">Email</label>
                                <input
                                    type="text"
                                    id="email_field"
                                    className="form-control"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>


                            <div className="form-group">
                                <label htmlFor="role_field">Role</label>
                                <select disabled={user._id === authUser._id} value={role} onChange={e => setRole(e.target.value)} className="form-control" id="role_field">
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>
                            </div>

                            <button
                                id="login_button"
                                type="submit"
                                disabled={loading}
                                className="btn btn-block py-3">
                                {loading ? 'loading...' : 'UPDATE'}
                            </button>

                        </form>
                    </div>

                </div>
            </div>
        </>
    )
}
