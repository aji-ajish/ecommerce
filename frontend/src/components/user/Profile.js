import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import MetaData from '../layouts/MetaData'

export default function Profile() {
    const {user } = useSelector((state) => state.authState)
    return (
        <>
        <MetaData title={'Profile'} />
            <h2 className="mt-5 ml-5">My Profile</h2>
            <div className="row justify-content-around mt-5 user-info">
                <div className="col-12 col-md-3">
                    <figure className='avatar avatar-profile'>
                        <img className="rounded-circle img-fluid" src={user.avatar ?? './images/default_avatar.png'} alt='user profile' />
                    </figure>
                    <Link to="/myprofile/update" id="edit_profile" className="btn btn-primary btn-block my-5">
                        Edit Profile
                    </Link>
                </div>

                <div className="col-12 col-md-5">
                    <h4>Full Name</h4>
                    <p>{user.name}</p>

                    <h4>Email Address</h4>
                    <p>{user.email}</p>

                    <h6>Joined</h6>
                    <small>{String(user.createdAt).substring(0,10)}</small>

                    <Link to="/orders" className="btn btn-danger btn-block mt-5">
                        My Orders
                    </Link>

                    <Link to="/myprofile/update/password" className="btn btn-primary btn-block mt-3">
                        Change Password
                    </Link>
                </div>
            </div>
        </>
    )
}
