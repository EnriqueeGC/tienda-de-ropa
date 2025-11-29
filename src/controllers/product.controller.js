const multer = require("multer");
const { storage } = require("../config/cloudinary.js");
const cloudinary = require("cloudinary").v2;
const upload = multer({ storage });

const db = require("../config/db.js");
const { where } = require("sequelize");
const Products = db.Product;
const ProductsVariants = db.ProductsVariants;

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, subCategoryId } = req.body;

    const newProduct = await Products.create({
      name,
      description,
      price,
      subCategoryId,
    });

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating product",
      error: error.message,
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const products = await Products.findAll();

    if (products.length === 0) {
      return res.status(404).json({
        message: "No products found",
      });
    }

    res.status(200).json({
      message: "Products retrieved successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving products",
      error: error.message,
    });
  }
};

exports.findProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Products.findByPk(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product found",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving product",
      error: error.message,
    });
  }
};

exports.findBySubcategoryId = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Products.findAll({
      where: {
        subCategoryId: id,
      },
    });

    if (product.length === 0) {
      return res.status(404).json({
        message: "No products found for this subcategory",
      });
    }

    res.status(200).json({
      message: "Products found",
      products: product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving products",
      error: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, subCategoryId } = req.body;

    const product = await Products.findByPk(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        error: "No product found with the given ID",
      });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.subCategoryId = subCategoryId || product.subCategoryId;

    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating product",
      error: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Products.findByPk(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.destroy();

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
};
