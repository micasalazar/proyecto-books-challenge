const express = require('express');
const mainController = require('../controllers/main');
const guessMiddleware= require('../middleware/guessMiddleware')

const router = express.Router();

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
router.put('/books/edit/:id', mainController.processEdit);//--------->PROCESSEDIT

module.exports = router;
