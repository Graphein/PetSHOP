const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(session({
    secret: 'secreto',
    resave: true,
    saveUninitialized: true
}));

const requireLogin = (req, res, next) => {
    if (req.session.loggedin) {
        next();
    } else {
        res.redirect('/login');
    }
};

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'seuUsuario' && password === 'suaSenha') {
        req.session.loggedin = true;
        req.session.username = username;
        res.cookie('ultimoAcesso', new Date().toString(), { maxAge: 30 * 60 * 1000 });
        res.redirect('/');
    } else {
        res.send('Credenciais inválidas!');
    }
});

app.get('/', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/cadastrarInteressado', (req, res) => {
    const { nome, email, telefone } = req.body;

    if (!nome || !email || !telefone) {
        res.send('Preencha todos os campos.');
        return;
    }

    res.send('Interessado cadastrado com sucesso!');
});

app.post('/cadastrarPet', (req, res) => {
    const { nome, raca, idade } = req.body;

    if (!nome || !raca || !idade) {
        res.send('Preencha todos os campos.');
        return;
    }

    res.send('Pet cadastrado com sucesso!');
});

app.post('/adotarPet', (req, res) => {

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});