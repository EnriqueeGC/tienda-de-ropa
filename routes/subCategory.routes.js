const express = require('express');
const subcategoryController = require('../controllers/subCategory.controller.js');

const router = express.Router();

router.post('/create', subcategoryController.create);
router.get('/getAll', subcategoryController.getAll);
router.get('/getSubcategoriesByCategoryId/:id_categoria', subcategoryController.getSubcategoriesByCategoryId);
router.delete('/deleteById/:id_subcategoria', subcategoryController.deleteById);

module.exports = router;