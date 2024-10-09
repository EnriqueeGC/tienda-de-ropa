const express = require('express');
const userController = require('../controllers/user.controller.js');
const userMiddleware = require('../middlewares/user.middleware.js');

const router = express.Router();

router.post('/register', userMiddleware.validateUser, userMiddleware.validateResults, userController.registerUser);
router.get('/getAll', userController.getAllUsers);
router.get('/getUserById/:usuarioId', userController.getUsersById);
router.get('/getUserByName', userController.getUsersByName); // /getByName?nombre=ejemplo
router.get('/getUserBySecondName', userController.getUserBySecondName); // /getByEmail?correoElectronico=ejemplo
router.delete('/deleteUserById/:userControllerId', userController.deleteUserById);
router.put('/updateUserById/:usuarioID', userMiddleware.validateUser, userMiddleware.validateResults, userController.updateUser);

module.exports = router;