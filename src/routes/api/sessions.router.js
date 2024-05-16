import { Router } from "express";

const router = Router()

router.post('/login', (req, res) => {
    const {email, password} = req.body

    if(email !== 'fede@gmail.com' || password !== 'fedeElMejor') return res.send('login failed')

    req.session.user = {
        email,
        admin: true
    }
    res.send('login success')
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) return res.send({status: 'error', err})
        else return res.send('logout')
    })
})

export default router