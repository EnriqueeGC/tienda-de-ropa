const { body, validationResult } = require('express-validator');

const validateUser = [
    body('nombre').isString().isLength({ min: 2 }).withMessage('Nombre es requerido'),
    body('correoElectronico').isEmail().withMessage('Correo Electronico no es valido'),
    body('nombreUsuario').isString().isLength({ min: 1 }).withMessage('Nombre de Usuario es requerido'),
    body('contrasena').isString().isLength({ min: 4 }).withMessage('Contrasenia debe contener al menos 4 caracteres')
];

const validateResults = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }
    next();
};

module.exports = { validateUser, validateResults };