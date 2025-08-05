const { body, validationResult } = require('express-validator');

const validateArticle = [
    body('nombre_producto').isString().trim().escape().withMessage('Nombre del producto es requerido'),
    body('descripcion').isString().trim().escape().withMessage('Descripcion es requerido'),
    body('precio').isFloat({ gt: 0 }).withMessage('Precio es requerido (0.00)')
];

const validateResults = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }
    next();
};

module.exports = { validateArticle, validateResults }