const express = require('express');
const discountController = require('../controllers/discount.controller');
const discountMiddleware = require('../middlewares/discount.middleware');

const router = express.Router();

router.post('/createDiscount', discountMiddleware.validateDiscount, discountMiddleware.validateResults, discountController.createDiscount);
router.get('/getAll', discountController.findAllDiscounts);
router.get('/getById/:id_descuento', discountController.findById);
router.get('/getByType', discountController.findByType);
router.put('/updateDiscountById/:id', discountController.updateDiscount);
router.delete('/deleteDiscountById/:id', discountController.deleteDiscountById);

module.exports = router;