const express = require('express');
const router = express.Router();
const mainController = require('../controllers/main');
const multer = require('multer');
const path = require('path');
const guessMiddleware= require('../middleware/guessMiddleware');
const validatorRegister = require('../middleware/validatorRegister')

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
router.put('/books/edit/:id',uploadFile.single("cover"), validatorRegister , mainController.processEdit);//--------->PROCESSEDIT

module.exports = router;
