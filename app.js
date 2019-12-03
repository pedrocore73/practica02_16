let express = require('express');

let app = express();
let bodyParser = require('body-parser');

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({'extended':'false'}));

let http = require('http').Server(app);
let io = require('socket.io')(http);

let users = [];
let mensajes = [];

io.on('connection', socket => {
    
    let user = new Object();
    if(!users.some(user => user.id === socket.id) || users.length === 0) {
        user.id = socket.id;

        socket.on('start', data => {
            user.nombre = (JSON.parse(data)).nombre;
            users.push(user);
            mensajes.forEach(mensaje => {
                io.to(socket.id).emit('mensaje', JSON.stringify(mensaje));
            })
            io.emit('mensaje', JSON.stringify(users));
        })
    }

    socket.on('mensaje', data =>{
        let mensajeBack = {
            nombre: (JSON.parse(data)).nombre,
            avatar: (JSON.parse(data)).avatar,
            texto: (JSON.parse(data)).texto,
            fecha: new Date()
        }
        mensajes.push(mensajeBack);
        io.emit('mensaje', JSON.stringify(mensajeBack));
    })

    socket.on('disconnect', ()=> {
        console.log('Un cliente se ha desconectado');
    })
})



http.listen(3000, () => {
    console.log('Servidor ok en http://localhost:3000');
});