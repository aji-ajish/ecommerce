const Product = require('../models/productModel')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middlewares/catchAsyncError')
const APIFeatures = require('../utils/apiFeatures')

//get products  /api/v1/products
exports.getProducts = async (req, res, next) => {
    const resultPerPage = process.env.RESULT_PER_PAGE;
    const apiFeatures = new APIFeatures(Product.find(), req.query).search().filter().paginate(resultPerPage)

    const products = await apiFeatures.query;
    res.status(200).json({
        success: true,
        count: products.length,
        products
    });
}

//add product  /api/v1/admin/product/new
exports.newProduct = catchAsyncError(async (req, res, next) => {
    req.body.user = req.user.id;
    const product = await Product.create(req.body)
    res.status(201).json({
        success: true,
        product
    })
})

//get single product  /api/v1/product/:id
exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler('Product not found', 400))
    }
    res.status(201).json({
        success: true,
        product
    })
})

// update product /api/v1/product/:id
exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 400))
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(201).json({
        success: true,
        product
    })

})

// delete product  /api/v1/product/:id
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 400))
    }

    await product.deleteOne()

    res.status(201).json({
        success: true,
        message: "Product Deleted!"
    })
})