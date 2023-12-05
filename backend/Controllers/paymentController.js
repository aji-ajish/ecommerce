const catchAsyncError = require('../middlewares/catchAsyncError')
const stript = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.processPayment = catchAsyncError(async (req, res, next) => {
    const paymentIntents = await stript.paymentIntents.create({
        amount: req.body.amount,
        currency: "inr",
        description: "TEST PAYMENT",
        metadata: { integration_check: 'accept_payment' },
        shipping: req.body.shipping
    })
    res.status(200).json({
        success: true,
        client_secret: paymentIntents.client_secret
    })
})

exports.sendStripeApi = catchAsyncError(async (req, res, next) => {

    res.status(200).json({
        success: true,
        striptApiKey: process.env.STRIPE_API_KEY
    })
})