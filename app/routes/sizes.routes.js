const express = require('express'); 
const sizesController = require('../controllers/sizes.controller.js');

const router = express.Router();

router.get('/getAllSizes', sizesController.getAllSizes);

module.exports = router;

