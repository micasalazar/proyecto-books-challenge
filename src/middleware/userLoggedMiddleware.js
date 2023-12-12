function userLoggedMiddleware(req, res, next) {
    res.locals.usuarioALoguear = false;

    if (req.session.usuarioALoguear) {
        res.locals.usuarioALoguear = req.session.usuarioALoguear;
    }

    // console.log('userLogueado structure:', res.locals.usuarioALoguear);
    // console.log('session.userLogueado:', req.session.usuarioALoguear);

    next();
}


module.exports = userLoggedMiddleware;