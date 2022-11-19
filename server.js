// declarando as dependecias
const express = require('express');
const path = require('path');

// criando o servidor
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// definindo a rota dos arquivos publicos e estaticos do chat
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// definindo o comportamento ao acessar o index.html (rota raiz do projeto)
app.use('/', function(req, resp){
    resp.render('index.html');
});

// guarda todas as mensagens
let messages = []

// conexão do usuario com o servidor
io.on('connection', socket => {
    console.log("conect:" + socket.id)

    // envia as mensagens anteriores ao usuario recem conectado
    socket.emit('previousMessages', messages    )

    // recebe a mensage enviada pelo usuario, recebendo o mesmo evento do usuario
    socket.on("sendMessage", data => {
        messages.push(data)

        // manda as mensagens para todos os usuarios    
        socket.broadcast.emit('receiveMessages', data)
    })
})

// definindo a porta e o ip que o servidor irá rodar
server.listen(25000, '127.0.0.50')
