const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');

const secret = "gabriel"

app.use(cors('*'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

const delay = (amount = 750) => new Promise(resolve => setTimeout(resolve, amount));

function verifyJWT(req, res, next) {
    const token = req.headers['authorization']

    if(!token) {
        return res.status(400).json({ message: 'Token inválido' })
    }

    jwt.verify(token, secret, (err, decoded) => {
        console.log(err)
        if(err) return res.status(401).send()

        req.userId = decoded.userId;

        next()
    })
}

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    await delay();

    if(email !== 'gabriel@gmail.com' || password !== '123456') {
        return res.status(401).send('Não autorizado')
    }

    const token = jwt.sign({userId: 1}, secret, { expiresIn: 60 * 60 * 60 })
    res.json({ auth: true, token, user: { name: 'Gabriel Azevedo', email } });
})

app.get('/me', verifyJWT, async (req, res) => {
    await delay()
    res.json({ user: { name: 'Gabriel Azevedo', email: 'gabriel@gmail.com' } });
})

app.post('/dash', verifyJWT, async (req, res) => {
    await delay();
    
    res.send('OK')
})

app.listen(3030, () => console.log('Api Funcionando\n\n'));