function guessMiddleware(req, res, next){
    if (req.session.usuarioALoguear) {
        const usuarioALoguear = req.session.usuarioALoguear
        return res.redirect('/login'+ usuarioALoguear.id);
    } 
    next();
}

module.exports= guessMiddleware