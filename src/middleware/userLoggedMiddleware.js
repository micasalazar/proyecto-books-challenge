function userLoggedMiddleware(req, res, next){
    res.locals.isLogged = false;

    if(req.session.userLogueado){
        res.locals.isLogged =true;
        res.locals.userLogueado = req.session.userLogueado;
    }
    console.log('userLogueado structure:', res.locals.userLogueado);
    console.log('session.userLogueado:', req.session);
    next()
}

module.exports = userLoggedMiddleware;