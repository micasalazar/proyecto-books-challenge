const bcryptjs = require('bcryptjs');
const db = require('../database/models');
const {Op} = require('sequelize')

const mainController = {
  home: (req, res) => {
    db.Book.findAll({
      include: [{ association: 'authors' }]
    })
      .then((books) => {
        res.render('home', { books });
      })
      .catch((error) => console.log(error));
  },
  bookDetail: async (req, res) => {
     // Implement look for details in the database
    try{
      const bookFinded = await db.Book.findByPk(req.params.id, {
        include: [{
          model: db.Author,
          as: 'authors' 
        }]
      })
      if(bookFinded){
        res.render('bookDetail', {book: bookFinded});        
      }else{
        res.status(404).send('Book not Found!')
      }
    }catch(error){
      console.error("Error al buscar el libro" + error);
      res.status(500).send('Error de servidor')
    }   
  },
  bookSearch: (req, res) => {
    res.render('search', { books: [] });
  },
  bookSearchResult: async (req, res) => {
    // Implement search by title
    try{
      const {title} = req.body;
      if(!title){
        res.render('search', {books: []})
      }
      const books = await db.Book.findAll({
        where:{
          title:{
            [db.Sequelize.Op.like]: `%${title.toUpperCase()}%`
          }
        },
        include:[{association: 'authors'}]
      });
      // console.log('Libros encontrados:', books)
      res.render('search', {books})
    }catch(error){
      console.error('Error al realizar la búsqueda ' + error);
      res.status(500).send('Error de servidor')
    }  
  },
  deleteBook: (req, res) => {
    // Implement delete book
    res.render('home');
  },
  authors: (req, res) => {
    db.Author.findAll()
      .then((authors) => {
        res.render('authors', { authors });
      })
      .catch((error) => console.log(error));
  },
  authorBooks: async (req, res) => {
    // Implement books by author
    try{
      const authorById = req.params.id;
      const author = await db.Author.findByPk(authorById, {
        include:[{ model: db.Book, as:'books', through:{attributes:[]}}]
      });
      if(author){
        res.render('authorBooks', {author});
      }else{
        res.status(404).send('El autor no fuen encontrado')
      }
    }catch{
      console.error('Error al obtener los libros del autor ' + error);
      res.status(500).send('Error de servidor')
    }
    },
  register: (req, res) => {
    res.render('register');
  },
  processRegister: (req, res) => {
    db.User.create({
      Name: req.body.name,
      Email: req.body.email,
      Country: req.body.country,
      Pass: bcryptjs.hashSync(req.body.password, 10),
      CategoryId: req.body.category
    })
      .then(() => {
        res.redirect('/');
      })
      .catch((error) => console.log(error));
  },
  login: (req, res) => {
    // Implement login process
    res.render('login');
  },
  processLogin: (req, res) => {
    // Implement login process
    res.render('home');
  },
  edit: (req, res) => {
    // Implement edit book
    res.render('editBook', {id: req.params.id})
  },
  processEdit: (req, res) => {
    // Implement edit book
    res.render('home');
  }
};

module.exports = mainController;
