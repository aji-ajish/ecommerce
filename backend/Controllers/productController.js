const Product = require('../models/productModel')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middlewares/catchAsyncError')
const APIFeatures = require('../utils/apiFeatures')

//get products  /api/v1/products
exports.getProducts = async (req, res, next) => {
    const resultPerPage = process.env.RESULT_PER_PAGE;

    let buildQuery = () => {
        return new APIFeatures(Product.find(), req.query).search().filter()
    }

    const filteredProductsCount = await buildQuery().query.countDocuments({})
    const totalProductsCount = await Product.countDocuments({});
    let productsCount = totalProductsCount;

    if (filteredProductsCount !== totalProductsCount) {
        productsCount = filteredProductsCount;
    }

    const products = await buildQuery().paginate(resultPerPage).query;

    res.status(200).json({
        success: true,
        count: productsCount,
        resultPerPage,
        products
    });
}

//add product  /api/v1/admin/product/new
exports.newProduct = catchAsyncError(async (req, res, next) => {
    let images = []
    if (req.files.length > 0) {
        req.files.forEach(file => {
            let url = `${process.env.BACKEND_URL}/uploads/products/${file.originalname}`
            images.push({ image: url })
        })
    }

    req.body.images = images;

    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
});

//get single product  /api/v1/product/:id
exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name email')
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

    // uploading images
    let images = []

    // if images not cleared we keep existing images
    if (req.body.imagesCleared === 'false') {
        images = product.images;
    }

    if (req.files.length > 0) {
        req.files.forEach(file => {
            let url = `${process.env.BACKEND_URL}/uploads/products/${file.originalname}`
            images.push({ image: url })
        })
    }

    req.body.images = images;

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

//create review api/v1/review
exports.createReview = catchAsyncError(async (req, res, next) => {
    const { productId, rating, comment } = req.body

    const review = {
        user: req.user.id,
        rating,
        comment
    }

    const product = await Product.findById(productId);
    // finding user review exists
    const isReviewed = product.reviews.find(review => {
        return review.user.toString() == req.user.id.toString()
    })

    if (isReviewed) {
        // update the review
        product.reviews.forEach(review => {
            if (review.user.toString() == req.user.id.toString()) {
                review.comment = comment
                review.rating = rating
            }
        })
    } else {
        // creating the review
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    // find the average of the product reviews
    product.ratings = product.reviews.reduce((acc, review) => {
        return review.rating + acc
    }, 0) / product.reviews.length;
    product.ratings = isNaN(product.ratings) ? 0 : product.ratings

    await product.save({ validateBeforeSave: false })
    res.status(200).json({
        success: true
    })
})

//get review api/v1/reviews?id={}
exports.getReview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id).populate('reviews.user', 'name email')
    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

//delete review api/v1/reviews?id={}&productId={}
exports.deleteReview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId)
    // filtering the reviews wich does match the deleting revieww is
    const reviews = product.reviews.filter(review => {
        return review._id.toString() !== req.query.id.toString()
    })
    // number of reviews
    const numOfReviews = reviews.length
    // find the average with the filtered reviews
    let ratings = reviews.reduce((acc, review) => {
        return review.rating + acc
    }, 0) / reviews.length;
    ratings = isNaN(ratings) ? 0 : ratings
    // save the product document
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        numOfReviews,
        ratings
    })
    res.status(200).json({
        success: true
    })
})

//get admin products api/v1/admin/products
exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
    const products = await Product.find()
    res.status(200).json({
        success: true,
        products
    })
})