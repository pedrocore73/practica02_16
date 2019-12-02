let express = require('express');

let app = express();
let bodyParser = require('body-parser');

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({'extended':'false'}));

let http = require('http').Server(app);
let io = require('socket.io')(http);

io.on('connection', socket => {
    console.log('Un cliente se ha conectado');

    socket.on('disconnect', ()=> {
        console.log('Un cliente se ha desconectado');
    })

})

http.listen(3000, () => {
    console.log('Servidor ok en http://localhost:3000');
});