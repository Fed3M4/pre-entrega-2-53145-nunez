function auth(req, res, next) {
    if(req.session?.user?.email === 'fede@gmail.com' && req.session?.admin) {
        return next()
    }
    return res.status(401).send('error de autorización')
}