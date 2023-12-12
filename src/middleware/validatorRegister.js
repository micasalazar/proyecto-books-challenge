const {body} = require('express-validator');

console.log("PASANDO POR VALIDATOR");

// Validaciones
const validatorRegister = [
    body('name').notEmpty().withMessage('Tiene que escribir un nombre'),
    body('email')
                .notEmpty().withMessage('Tiene que escribir un correo electrónico').bail()
                .isEmail().withMessage('Debes escribir un formato de correo válido'),
    body('country').notEmpty().withMessage('Tiene que elegir un país'),
    body('pass').notEmpty().withMessage('Tienes que escribir una contraseña'),
    body('category').notEmpty().withMessage('Tienes que seleccionar una categoría')   

];
module.exports= validatorRegister;
