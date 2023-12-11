const express = require('express');
const mainRouter = require('./routes/main');
const methodOverride = require('method-override');
const session = require('express-session');

const app = express();
const userLoggedMiddleware = require('./middleware/userLoggedMiddleware');
const cookie = require('cookie-parser')

app.use(session({
  secret: 'un_secreto',
  resave: false,
  saveUninitialized: true
}));
app.use(cookie());
app.use(userLoggedMiddleware);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', 'src/views');

app.use('/', mainRouter);

app.listen(3000, () => {
  console.log('listening in http://localhost:3000');
});
