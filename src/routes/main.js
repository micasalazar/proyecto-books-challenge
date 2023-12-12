const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const mainController = require('../controllers/main');
const multer = require('multer');
const path = require('path');
const guessMiddleware= require('../middleware/guessMiddleware');

const storage = multer.diskStorage({
    destination: async(req,file,cb)=>{
        let folder = path.join(__dirname,'../../public/img/libros')        
        cb(null,folder)
    },
    filename: (req,file,cb)=>{
        const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))       

    }
})
const uploadFile = multer ({ storage})

// Validaciones
const validations = [
    body('name').notEmpty().withMessage('Tiene que escribir un nombre'),
    body('email')
                .notEmpty().withMessage('Tiene que escribir un correo electrónico').bail()
                .isEmail().withMessage('Debes escribir un formato de correo válido'),
    body('country').notEmpty().withMessage('Tiene que elegir un país'),
    body('pass').notEmpty().withMessage('Tienes que escribir una contraseña'),
    body('category').notEmpty().withMessage('Tienes que seleccionar una categoría')   

]


router.get('/', mainController.home);
router.get('/books/detail/:id', mainController.bookDetail);
router.get('/books/search', mainController.bookSearch);
router.post('/books/search', mainController.bookSearchResult);
router.get('/authors', mainController.authors);
router.get('/authors/:id/books', mainController.authorBooks);
router.get('/users/register', guessMiddleware, mainController.register);
router.post('/users/register', mainController.processRegister);
router.get('/users/login',guessMiddleware, mainController.login);
router.get("/users/logout", mainController.logout)
router.post('/users/login', mainController.processLogin);
router.delete('/books/:id', mainController.deleteBook);

router.get('/books/edit/:id', mainController.edit);//--------->EDIT
router.put('/books/edit/:id',uploadFile.single("cover"), validations , mainController.processEdit);//--------->PROCESSEDIT

module.exports = router;
