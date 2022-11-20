// criando a conexão do usuario com o servidor
var socket = io('http://127.0.0.50:25000');

// recebe a mensagens dos usuarios
socket.on('receiveMessages', (message) => {
    populationMessage(message)
});

// recebe as mensagens anteriores assim que se conectar (mensagens gravadas no txt)
socket.on('previousMessages', (messages)=>{
    for(message of messages){
        let text = JSON.parse(message)
        populationMessage(text)
    }
})


// funcao para enviar a mensagem do usuario
$("#chat").submit(event =>{
    event.preventDefault();

    var author = $("#username").val();
    var message = $("#message").val();

    // envia a mensagem do usuario por meio de um objeto, caso o mesmo tenha informado a mensagem e seu nome de usuario
    if(author.length > 0 && message.length > 0){

        // cria o objeto da mensagem
        var objectMessage = {
            author,
            message
        };;

        //popula a mensagem dentro da div
        populationMessage(objectMessage)

        // envia o objeto contendo a mensagem e o autor para o socket (servidor)
        socket.emit("sendMessage", objectMessage)
    }
})

function populationMessage(message){
    $("#messages").append(`<div class="message"><strong>${message.author}: </strong>${message.message}</div>`)
}
