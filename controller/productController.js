const Product = require("../models/ProductSchema");
const ErrorHander = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");

//create product --admin

exports.createProduct = catchAsyncError(async(req, res, next) => {
    req.body.user = req.user.id;
    const product = await Product.create(req.body)

    res.status(201).json({
        success: true,
        product
    })
});
// get all products
exports.getAllProducts = catchAsyncError(async(req, res, next) => {
    const resultPerPage = 5;

    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage)
    const products = await apiFeature.query;

    res.status(200).json({
        success: true,
        products
    })
});
//update products --admin
exports.updateProduct = catchAsyncError(async(req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHander("Product not found", 404));
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        product,
    });
});
//get single product details
exports.getProductDetails = catchAsyncError(async(req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHander("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        product

    });
});

//delete product

exports.deleteProduct = catchAsyncError(async(req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHander("Product not found", 404));
    }
    await product.remove()

    res.status(200).json({
        success: true,
        message: 'product deleted succesfully'

    });
});