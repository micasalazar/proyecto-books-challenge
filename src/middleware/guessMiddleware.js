function guessMiddleware(req, res, next){
    if (req.session.userLogueado) {
        const userLogueado = req.session.userLogueado 
        return res.redirect('/login'+ userLogueado.id);
    } 
    next();
}

module.exports= guessMiddleware