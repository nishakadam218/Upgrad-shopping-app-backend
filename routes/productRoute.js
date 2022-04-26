const express = require("express");
const router = express.Router();

const { createProduct, getAllProducts, updateProduct, deleteProduct, getProductDetails } = require("../controller/productController")

router.route("/products").get(getAllProducts)

router.route("/product/new").post(createProduct)

router.route("/product/:id").put(updateProduct).delete(deleteProduct).get(getProductDetails)

module.exports = router;