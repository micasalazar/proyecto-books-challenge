const bcryptjs = require('bcryptjs');
const db = require('../database/models');
const {Op} = require('sequelize')
const sequelize = db.sequelize;

const mainController = {
  home: (req, res) => {
    db.Book.findAll({
      include: [{ association: 'authors' }]
    })
      .then((books) => {
        res.render('home', { books, usuarioALoguear:req.session.usuarioALoguear });
      })
      .catch((error) => console.log(error));
  },
  bookDetail: async (req, res) => {
     
    try{
      const bookFinded = await db.Book.findByPk(req.params.id, {
        include: [{
          model: db.Author,
          as: 'authors' 
        }]
      })
      if(bookFinded){
        res.render('bookDetail', {book: bookFinded, usuarioALoguear:req.session.usuarioALoguear});        
      }else{
        res.status(404).send('Book not Found!')
      }
    }catch(error){
      console.error("Error al buscar el libro" + error);
      res.status(500).send('Error de servidor')
    }   
  },
  bookSearch: (req, res) => {
    res.render('search', { books: [], usuarioALoguear:req.session.usuarioALoguear });
  },
  bookSearchResult: async (req, res) => {
    
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
      res.render('search', {books, usuarioALoguear:req.session.usuarioALoguear })
    }catch(error){
      console.error('Error al realizar la búsqueda ' + error);
      res.status(500).send('Error de servidor')
    }  
  },
  deleteBook: async (req, res) => {    
    try {
      await db.sequelize.query('DELETE FROM BooksAuthors WHERE BookId = :bookId', {
        replacements: { bookId: req.params.id },
        type: db.sequelize.QueryTypes.DELETE,
      });
      const deleteBook = await db.Book.destroy({
        where: { id: req.params.id },
      });
      
      console.log('Resultado de la eliminación:', deleteBook);
      
      if (deleteBook) {
        res.redirect('/');
      } else {
          res.status(404).send('Libro no encontrado');
      }
  } catch (error) {
      console.error('Error al intentar borrar el libro y sus relaciones', error);
      res.status(500).send('Error de servidor');
  }
  
  },
  authors: (req, res) => {
    db.Author.findAll()
      .then((authors) => {
        res.render('authors', { authors, usuarioALoguear:req.session.usuarioALoguear });
      })
      .catch((error) => console.log(error));
  },
  authorBooks: async (req, res) => {
   
    try{
      const authorById = req.params.id;
      const author = await db.Author.findByPk(authorById, {
        include:[{ model: db.Book, as:'books', through:{attributes:[]}}]
      });
      if(author){
        res.render('authorBooks', {author, usuarioALoguear:req.session.usuarioALoguear});
      }else{
        res.status(404).send('El autor no fuen encontrado')
      }
    }catch{
      console.error('Error al obtener los libros del autor ' + error);
      res.status(500).send('Error de servidor')
    }
    },
  register: (req, res) => {
    res.render('register', { usuarioALoguear:req.session.usuarioALoguear });
  },
  processRegister: (req, res) => {
    db.User.create({
      Name: req.body.name,
      Email: req.body.email,
      Country: req.body.country,
      Pass: bcryptjs.hashSync(req.body.pass, 10),
      CategoryId: req.body.category
    })
      .then(() => {
        res.redirect('/');
      })
      .catch((error) => console.log(error));
  },
  login: (req, res) => {
    
    
    return res.render('login', { usuarioALoguear:req.session.usuarioALoguear });

  },
  processLogin: async (req, res) => { 
      try {
        console.log(req.body);
        console.log(req.session);

        const userEmail = req.body.email;

        if (userEmail) {
            const usuarioALoguear = await db.User.findOne({
                where: { email: userEmail }
            });

            if (usuarioALoguear) {
                let passOk = bcryptjs.compareSync(req.body.pass, usuarioALoguear.Pass);
                if (passOk) {
                    delete usuarioALoguear.Pass;
                    req.session.usuarioALoguear = usuarioALoguear;
                    res.cookie("email", userEmail, { maxAge: (4000 * 60) * 10 });
                    return res.redirect('/');
                }
                console.log('Contraseña incorrecta');
                return res.render('login', { error: 'Contraseña incorrecta' });
            } else {
                console.log('Usuario no encontrado');
                return res.render('login', { error: 'Usuario no encontrado' });
            }
        } else {
            console.log('Email no proporcionado');
            return res.render('login', { error: 'Email no proporcionado' });
        }
    } catch (error) {
        console.error('Error al procesar el inicio de sesión ' + error);
        res.status(500).send('Error del Servidor');
    
    }
      //   console.log(req.body);
      //   console.log(req.session);

      //     const usuarioALoguear = await db.User.findOne({ 
      //     where: { email: req.body.email }
      //   }); 
      //   if(usuarioALoguear){
      //     let passOk = bcryptjs.compareSync( req.body.pass, usuarioALoguear.Pass);
      //     if(passOk){
      //       delete usuarioALoguear.Pass;              
      //           req.session.usuarioALoguear = usuarioALoguear;
      //           res.cookie("email", req.body.email, { maxAge: (4000 * 60) * 10 });
      //           res.redirect('/');
      //     }
      //     console.log( 'usuarioALoguear', usuarioALoguear)
      //   }else{
      //     console.log('Contraseña incorrecta');
      //     return res.render('login', { error: 'Contraseña incorrecta' });
      //   }
  
      // } catch (error) {
      //   console.error('Error al procesar el inicio de sesión ' + error);
      //   res.status(500).send('Error del Servidor');
      // }      
},
logout: (req, res) =>{
  req.session.destroy();
  console.log(req.session);
  res.clearCookie("email")
  return res.redirect('/');

},
  edit: async(req, res) => {   
    try{
      const book = await db.Book.findByPk(req.params.id);
      if(!book){
        return res.status(404).send('Libro no encontrado')
      }
      res.render('editBook',{book, id: req.params.id,  usuarioALoguear:req.session.usuarioALoguear})
      console.log('Query de Sequelize para obtener el usuario:', query);
    }catch(error){
      console.error('Error al intentar editar un libro ' + error)
      res.status(500).send('Error de Servidor')
    }
    
  },
  processEdit: async (req, res) => {

    try{
      const bookFound = await db.Book.findOne({
        where: { id: req.params.id },
      })
      await bookFound.update({
        ...req.body,        
      },
         {where: {id: req.params.id}})
         if (updateBook[0] > 0) {
             res.redirect('/');
            } else {
              res.status(404).send('Libro no encontrado'+ req.params.id);
            }

    }catch (error) {
        console.error('Error al intentar editar el libro ' + error);
        res.status(500).send('Error de Servidor');

    }
   
    // try {
    //   const { title, cover, description } = req.body;
    //   const bookId = req.params.id;

    
  
    //   const updateBook = await db.Book.update(
    //     { title, cover, description },
    //     { where: { id: bookId } }
    //   );
  
    //   if (updateBook[0] > 0) {
    //     res.redirect('/');
    //   } else {
    //     res.status(404).send('Libro no encontrado'+ req.params.id);
    //   }
    // } catch (error) {
    //   console.error('Error al intentar editar el libro ' + error);
    //   res.status(500).send('Error de Servidor');
    // }
    
    

  }
};

module.exports = mainController;
