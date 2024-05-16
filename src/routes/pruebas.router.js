import { Router } from "express";

const router = Router()

router.get('/setCookie', (req, res) => {
    res.cookie('CoderCookie', 'Esta es una cookie muy poderosa', {maxAge:10000}).send("Cookie")
})

router.get('/getCookies', (req, res) =>{
    res.send(req.cookies);
})

router.get('/deleteCookie', (req, res) =>{
    res.clearCookie('CoderCookie'.send('Cookie removed'))
})

router.get('/setSignedCookie', (req, res)=>{
    res.cookie('SignedCookie', 'Esta es una cookie muy poderosa', {maxAge:10000, signed:true}).send("Cookie")
})

router.get('/session', (req, res) => {
    if(req.session.counter){
        req.session.counter++
        res.send(`Se ha visitado el sitio ${req.session.counter} veces`)
    } else {
        req.session.counter = 1
        res.send('Bienvenidos')
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy( err => {
        if(err) return res.send({status: 'error', err})
            else return res.send('logout')
    })
})

export default router