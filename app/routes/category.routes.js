const express = require('express');
const categoryController = require('../controllers/category.controller');
const categoryMiddleware = require('../middlewares/category.middleware');

const router = express.Router();

router.post('/createCategory', categoryMiddleware.validateCategory, categoryMiddleware.validateResults, categoryController.createCategory);
router.get('/getAll', categoryController.getAll);
router.get('/getCategoryById/:id', categoryController.getCategoryById);
router.put('/updateCategoryById/:id', categoryController.updateCategory);
router.delete('/deleteCategoryById/:id', categoryController.deleteCategory);

module.exports = router;