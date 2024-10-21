const express = require('express');
const variantsProductController = require('../controllers/variantsProduct.controller.js');

const router = express.Router();

router.post('/addVariants/:id_producto', variantsProductController.addVariants);
router.get('/getVariants/:id_producto', variantsProductController.getAllVariantsProduct);
router.put('/updateVariantById/:id_variante', variantsProductController.updateVariantById);
router.delete('/deleteVariantById/:id_variante', variantsProductController.deleteVariantById);

module.exports = router;