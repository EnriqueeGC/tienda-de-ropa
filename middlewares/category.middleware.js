const { body, validationResult } = require('express-validator');

const validateCategory = [
    body('nombre_categoria').isString().trim().escape().withMessage('Nombre del producto es requerido'),
    body('genero').isIn([
        'Masculino',
        'Femenino',
        'Unisex'])
    .trim().escape().withMessage('El genero debe ser Masculino, Femenino o Unisex')
];

const validateResults = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }
    next();
};

module.exports = { validateCategory, validateResults }