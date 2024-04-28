const express = require("express");
const { getAllProducts, getProductById, updateProductById, createProduct, deleteProductById } = require("../controllers/products.controller");

const router = express.Router();

router.get("/", getAllProducts);

router.get("/:id", getProductById);

router.put("/:id", updateProductById);

router.post("/", createProduct);

router.delete("/:id", deleteProductById);

module.exports = router;