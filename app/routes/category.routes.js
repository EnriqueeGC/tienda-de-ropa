const express = require('express');
const categoryController = require('../controllers/category.controller');
const categoryMiddleware = require('../middlewares/category.middleware');

const router = express.Router();

router.post('/createCategory',  categoryController.createCategory);
router.get('/findAllCategories', categoryController.findAllCategories);
router.get('/findCategoryById/:id', categoryController.findCategoryById);
router.put('/updateCategory/:id', categoryController.updateCategory);
router.delete('/deleteCategoryById/:id', categoryController.deleteCategory);

module.exports = router;