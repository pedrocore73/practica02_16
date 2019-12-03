let express = require('express');

let app = express();
let bodyParser = require('body-parser');

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({'extended':'false'}));

let http = require('http').Server(app);
let io = require('socket.io')(http);

let users = [];

io.on('connection', socket => {
    
    let user = new Object();
    if(!users.some(user => user.id === socket.id) || users.length === 0) {
        user.id = socket.id;

        socket.on('start', data => {
            user.nombre = (JSON.parse(data)).nombre;
            users.push(user);
            io.emit('mensaje', JSON.stringify(users));
        })
    }

    console.log(users);

    socket.on('mensaje', data =>{
        console.log(data);
        io.emit('mensaje', data);
    })

    socket.on('disconnect', ()=> {
        console.log('Un cliente se ha desconectado');
    })
    console.log(users);
})



http.listen(3000, () => {
    console.log('Servidor ok en http://localhost:3000');
});