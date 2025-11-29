const express = require('express');
const subcategoryController = require('../controllers/subCategory.controller.js');

const router = express.Router();

router.post('/create', subcategoryController.createSubCategory);
router.get('/getAll', subcategoryController.findAllSubCategories);
router.get('/getSubcategoriesByCategoryId/:id_categoria', subcategoryController.findByCategory);
router.get('/getSubcategoryById/:id_subcategoria', subcategoryController.findById);
router.put('/update/:id_subcategoria', subcategoryController.updateSubCategory);
router.delete('/deleteById/:id_subcategoria', subcategoryController.deleteSubCategory);

module.exports = router;