const { body, validationResult } = require('express-validator');

const validateCategory = [
    body('nombre_categoria').isString().trim().escape().withMessage('Nombre de la categoria es requerido'),
];

const validateResults = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }
    next();
};

module.exports = { validateCategory, validateResults }