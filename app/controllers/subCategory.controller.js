const db = require("../config/db.js");
const SubCategories = db.SubCategories;

exports.createSubCategory = async (req, res) => {
  const { name, description, categoryId } = req.body;

  try {
    if (!name || !categoryId) {
      return res
        .status(400)
        .json({ message: "Name and category ID are required" });
    }

    const newSubCategory = await SubCategories.create({
      name,
      description,
      categoryId,
    });
    res.status(201).json({
      message: "Subcategory created successfully",
      subcategory: newSubCategory,
    });
  } catch (error) {
    console.error("Error creating subcategory:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.findAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategories.findAll();
    res.status(200).json({
      message: "Subcategories retrieved successfully",
      subcategories: subCategories,
    });
  } catch (error) {
    console.error("Error retrieving subcategories:", error);
    res.status(500).json({
      message: "Error retrieving subcategories",
    });
  }
};

exports.findById = async (req, res) => {
  const { id } = req.params;

  try {
  } catch (error) {
    console.error("Error retrieving subcategory by ID:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.findByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const subCategories = await SubCategories.findAll({
      where: {
        categoryId: categoryId,
      },
    });
    res.status(200).json({
      message: "Subcategories retrieved successfully",
      subcategories: subCategories,
    });
  } catch (error) {
    console.error("Error retrieving subcategories by category:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.updateSubCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description, categoryId } = req.body;

  try {
    const subCategory = await SubCategories.findByPk(id);
    if (!subCategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    subCategory.name = name || subCategory.name;
    subCategory.description = description || subCategory.description;
    subCategory.categoryId = categoryId || subCategory.categoryId;

    await subCategory.save();
    res.status(200).json({
      message: "Subcategory updated successfully",
      subcategory: subCategory,
    });
  } catch (error) {
    console.error("Error updating subcategory:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.deleteSubCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await SubCategories.destroy({
      where: { id },
    });

    if (deleted) {
      return res.status(200).json({
        message: "Subcategory deleted successfully",
      });
    }
    throw new Error("Subcategory not found");
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
