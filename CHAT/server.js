const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('login.html');
});

let messages = [];
let chaves = [];

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);

    socket.emit('previousMessages', messages);

    socket.on('sendMessage', data => {
        messages.push(data);
        var chave = Math.random().toString(16).slice(-8);
        chaves.push(chave);
        var msgCifra = RC4(chave, data);
        socket.broadcast.emit('receivedMessage', data);
        console.log(data);
    });
});

io.on('disconnect', socket => {
    console.log(`Socket desconectado: ${socket.id}`);
});

function RC4(key, text){
    var s = [], j =  0, x, res = '';
    for(var i = 0; i < 256; i++){
        s[i] = i;
    }
    for (i = 0; i < 256; i++){
        j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
        x = s[i];
        s[i] = s[j];
        s[j] = x;
    }
    i = 0;
    j = 0;

    for (var y = 0; y < text.length; y++){
        i = (i + 1) % 256;
        j = (j + s[i]) % 256;
        x = s[i];
        s[i] = s[j];
        s[j] = x;
        res += String.fromCharCode(text.charCodeAt(y) ^ s[(s[i] + s[j]) % 256]);
    }

    return res
}


server.listen(3000);
console.log("Servidor rodando em http://localhost:3000");