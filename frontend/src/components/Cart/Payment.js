import React, { useEffect } from 'react'
import CheckoutStep from './CheckoutStep'
import MetaData from '../layouts/MetaData'
import { useElements, useStripe, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { validateShipping } from './Shipping'
import axios from 'axios'
import { toast } from 'react-toastify'
import { orderComplete } from '../../slices/cartSlice'

export default function Payment() {
    const stripe = useStripe()
    const element = useElements()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'))
    const { user } = useSelector((state) => state.authState)
    const { items: cartItems, shippingInfo } = useSelector((state) => state.cartState)

    const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100),
        shipping: {
            name: user.name,
            address: {
                city: shippingInfo.city,
                postal_code: shippingInfo.postalCode,
                country: shippingInfo.country,
                state: shippingInfo.state,
                line1: shippingInfo.address
            },
            phone: shippingInfo.phoneNo
        }
    }

    const order = {
        orderItems: cartItems,
        shippingInfo
    }

    if (orderInfo) {
        order.itemPrice = orderInfo.itemPrice
        order.shippingPrice = orderInfo.shippingPrice
        order.taxPrice = orderInfo.taxPrice
        order.totalPrice = orderInfo.totalPrice
    }

    useEffect(() => {
        validateShipping(shippingInfo, navigate)
    }, [shippingInfo, navigate])

    const submitHandler = async (e) => {
        e.preventDefault()
        document.querySelector('#pay_btn').disable = true
        try {
            const { data } = await axios.post(`/api/v1/payment/process`, paymentData)
            const clientSecret = data.client_secret
            const result = stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: element.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email
                    }
                }
            })
            if (result.error) {
                toast((await result).error.message, {
                    type: 'error',
                    position: toast.POSITION.BOTTOM_CENTER
                })
                document.querySelector('#pay_btn').disable = false
            } else {
                if ((await result).paymentIntent.status === 'succeeded') {
                    toast('Payment Success', {
                        type: 'success',
                        position: toast.POSITION.BOTTOM_CENTER
                    })
                    dispatch(orderComplete())
                    navigate('order/success')
                } else {
                    toast('Please try again', {
                        type: 'warning',
                        position: toast.POSITION.BOTTOM_CENTER
                    })
                }
            }

        } catch (error) {

        }
    }

    return (
        <>
            <MetaData title={'Shipping Info'} />
            <CheckoutStep shipping confirmOrder payment />
            <div class="row wrapper">
                <div className="col-10 col-lg-5">
                    <form onSubmit={submitHandler} className="shadow-lg">
                        <h1 className="mb-4">Card Info</h1>
                        <div className="form-group">
                            <label htmlFor="card_num_field">Card Number</label>
                            <CardNumberElement
                                type="text"
                                id="card_num_field"
                                className="form-control"
                                value="" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="card_exp_field">Card Expiry</label>
                            <CardExpiryElement
                                type="text"
                                id="card_exp_field"
                                className="form-control"
                                value="" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="card_cvc_field">Card CVC</label>
                            <CardCvcElement
                                type="text"
                                id="card_cvc_field"
                                className="form-control"
                                value="" />
                        </div>


                        <button
                            id="pay_btn"
                            type="submit"
                            className="btn btn-block py-3">
                            Pay - {`${orderInfo && orderInfo.totalPrice}`}
                        </button>

                    </form>
                </div>
            </div>
        </>
    )
}
