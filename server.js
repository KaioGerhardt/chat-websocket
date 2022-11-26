// declarando as dependecias
const express = require('express');
const path = require('path');
const fs = require('fs');
const readline = require('readline')

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

//verifica se o arquivo messages.txt existe, se nao existir cria o arquivo
if(!fs.existsSync('./messages.txt')){
  fs.writeFileSync('./messages.txt', '')
}

// guarda todas as mensagens (mensagens do txt)
const dbMessages = fs.readFileSync('messages.txt', "utf8")
let messages = []
readFileByLine("messages.txt")

// conexão do usuario com o servidor
io.on('connection', socket => {
    console.log("conect:" + socket.id)

    // envia as mensagens anteriores ao usuario recem conectado
    socket.emit('previousMessages', messages)
    
    // recebe a mensage enviada pelo usuario, recebendo o mesmo evento do usuario
    socket.on("sendMessage", data => {
      
      // escreve as mensagens enviadas dos usuarios para o txt
      fs.appendFileSync('messages.txt', JSON.stringify(data) + '\r\n')
      
      // manda as mensagens para todos os usuarios    
      socket.broadcast.emit('receiveMessages', data)
    })
    
    // recebe o envento para apagar as mensagens do arquivo
    socket.on("deleteArchive", val => {
      
      if(val == true){
        fs.unlinkSync("./messages.txt");
        messages = []
        socket.broadcast.emit('previousMessages', messages)
      }

    })
})

// funcao para ler o arquivo linha a linha
async function readFileByLine(file) {
    const fileStream = fs.createReadStream(file);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    for await (const line of rl) {
      messages.push(line);
    }
   
}
// definindo a porta e o ip que o servidor irá rodar
server.listen(process.env.PORT)
