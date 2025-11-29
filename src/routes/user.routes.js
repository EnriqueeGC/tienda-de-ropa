const express = require('express');
const userController = require('../controllers/user.controller.js');
const userMiddleware = require('../middlewares/user.middleware.js');

const router = express.Router();

router.post('/register',  userController.registerUser);
router.get('/findAll', userController.findAllUsers);
router.get('/findById/:userId', userController.findById);
router.get('/findAllAdminUsers', userController.findAllAdminUsers);
router.put('/update/:userId', userController.updateUser);
router.delete('/delete/:userId', userController.deleteUser);

module.exports = router;