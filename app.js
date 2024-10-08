const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const app = express();

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'n0m3l0',
    database: '5IV8'
});

con.connect((err) => {
    if (err) {
        console.error("Error al conectar", err);
        return;
    }
    console.log("Conectado a la base de datos");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/agregarUsuario', (req, res) => {
    let nombre = req.body.nombre;

    con.query('INSERT INTO usuario (nombre) VALUES (?)', [nombre], (err, respuesta) => {
        if (err) {
            console.log("Error al insertar usuario", err);
            return res.status(500).send("Error al insertar usuario");
        }

        return res.send(`<h1>Nombre:</h1> ${nombre}`);
    });
});

app.get('/obtenerUsuario', (req, res) => {
    con.query('SELECT * FROM usuario', (err, respuesta) => {
        if (err) {
            console.log("Error al obtener usuarios", err);
            return res.status(500).send("Error al obtener usuarios");
        }

        let userHTML = '';
        let i = 0;
        respuesta.forEach(user => {
            userHTML += `<tr><td>${i}</td><td>${user.nombre}</td></tr>`;
            i++;
        });

        return res.send(`<html>
        <head>
        <title>Lista de Usuarios</title>
        </head>
        <body>
        <table>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
            </tr>
            ${userHTML}
        </table>
        </body>
        </html>`);
    });
});

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
