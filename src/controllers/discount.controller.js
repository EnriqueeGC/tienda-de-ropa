const db = require("../config/db.js");
const Discounts = db.Discounts;

exports.createDiscount = async (req, res) => {
  const { discount_type, discount_value, start_date, end_date } = req.body;

  const discountValue = await Discounts.findOne({
    where: { discount_value: discount_value },
  });

  if (discountValue) {
    return res.status(400).json({ message: "Discount value already exists" });
  }

  try {
    const newDiscount = await Discounts.create({
      discount_type,
      discount_value,
      start_date,
      end_date,
    });
    res.status(201).json({
      message: "Discount created successfully",
      discount: newDiscount,
    });
  } catch (error) {
    console.error(`Error creating discount: ${error}`);
    res.status(500).json({ error: "Error creating discount" });
  }
};

exports.findAllDiscounts = async (req, res) => {
  try {
    const discounts = await Discounts.findAll();
    res.status(200).json({
      message: "Discounts retrieved successfully",
      discounts: discounts,
    });
  } catch (error) {
    console.error(`Error retrieving discounts: ${error}`);
    res.status(500).json({ error: "Error retrieving discounts" });
  }
};

exports.findById = async (req, res) => {
  const { id } = req.params;

  try {
    const discount = await Discounts.findByPk(id);
    if (discount) {
      res.status(200).json({
        message: "Discount retrieved successfully",
        discount: discount,
      });
    } else {
      res.status(404).json({ message: `Discount not found with id: ${id}` });
    }
  } catch (error) {
    console.error(`Error retrieving discount by ID: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.findByType = async (req, res) => {
  const { discount_type } = req.query;
  
  if (!discount_type) {
    return res.status(400).json({ error: "The discount_type parameter is required" });
  }
    try {   
    const discounts = await Discounts.findAll({
        where: {
            discount_type: discount_type,
        },
        });
    if (discounts.length === 0) {
        return res.status(404).json({ message: "No discounts found" });
    }
    res.status(200).json({
        message: "Discounts retrieved successfully",
        discounts: discounts,
    });
    } catch (error) {
        console.error(`Error retrieving discounts by type: ${error}`);
        res.status(500).json({ message: "Error retrieving discounts" });
    }
};

exports.updateDiscount = async (req, res) => {
  const { id } = req.params;
  const { discount_type, discount_value, start_date, end_date } = req.body;

  try {
    const discount = await Discounts.findByPk(id);
    if (!discount) {
      return res.status(404).json({ message: "Discount not found" });
    }

    discount.discount_type = discount_type || discount.discount_type;
    discount.discount_value = discount_value || discount.discount_value;
    discount.start_date = start_date || discount.start_date;
    discount.end_date = end_date || discount.end_date;

    await discount.save();

    res.status(200).json({
      message: "Discount updated successfully",
      discount: discount,
    });
  } catch (error) {
    console.error(`Error updating discount: ${error}`);
    res.status(500).json({ error: "Error updating discount" });
  }
};

exports.deleteDiscountById = async (req, res) => {
  const { id } = req.params;

  try {
    const discount = await Discounts.findByPk(id);
    if (!discount) {
      return res.status(404).json({ message: "Discount not found" });
    }
    
    await discount.destroy();
    res.status(200).json({ message: "Discount deleted successfully", id: id });
  } catch (error) {
    console.error(`Error deleting discount: ${error}`);
    res.status(500).json({ error: "Error deleting discount" });
  }
};