const e = require("cors");
const db = require("../config/db.js");
const Category = db.Category;

exports.createCategory = async (req, res) => {
  const { name, description } = req.body;

  const existingCategory = await Category.findOne({ where: { name } });
  if (existingCategory) {
    return res.status(400).json({ message: "Category already exists" });
  }

  try {
    const newCategory = await Category.create({
      name,
      description,
    });
    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating category",
      error: error.message,
    });
  }
};

exports.findAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json({
      message: "Categories retrieved successfully",
      categories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving categories",
      error: error.message,
    });
  }
};

exports.findCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByPk(id);
    res.status(200).json({
      message: "Category retrieved successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving category",
      error: error.message,
    });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.name = name || category.name;
    category.description = description || category.description;

    await category.save();
    res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating category",
      error: error.message,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.destroy();
    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting category",
      error: error.message,
    });
  }
};
