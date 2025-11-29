const { body, validationResult } = require('express-validator');

const validateDiscount = [
    body('tipo_descuento').isString().trim().escape().withMessage('Tipo de descuento es requerido'),
    body('valor_descuento').isNumeric().withMessage('Porcentaje de descuento es requerido'),
    body('fecha_inicio').isDate().withMessage('Fecha de inicio es requerida'),
    body('fecha_fin').isDate().withMessage('Fecha de fin es requerida')
];

const validateResults = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }
    next();
};

module.exports = { validateDiscount, validateResults }