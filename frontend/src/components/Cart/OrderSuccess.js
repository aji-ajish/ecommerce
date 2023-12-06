import React from 'react'
import MetaData from '../layouts/MetaData'

export default function OrderSuccess() {
    return (
        <>
            <MetaData title={"Your Order has been placed successfully"} />
            <div className="row justify-content-center">
                <div className="col-6 mt-5 text-center">
                    <img className="my-5 img-fluid d-block mx-auto" src="/images/success.png" alt="Order Success" width="200" height="200" />

                    <h2>Your Order has been placed successfully.</h2>

                    <a href="/order">Go to Orders</a>
                </div>

            </div>
        </>
    )
}