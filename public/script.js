// criando a conexão do usuario com o servidor
var socket = io('http://127.0.0.50:25000');

// recebe a mensagens dos usuarios
socket.on('receiveMessages', (message) => {
    populationMessage(message)
});

// recebe as mensagens anteriores assim que se conectar (mensagens gravadas no txt)
socket.on('previousMessages', (messages)=>{

    // apaga as mensagens caso algum usuario tenha apagado o arquivo messages.txt
    if(messages = []){
        // apaga as mensagens do quadro
        $("#messages").children().remove()
    }

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

    if(author == undefined ||  author == ''){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Favor, digite um username para continuar!',
        })
    }

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

// funcao para escluir as mensagens do arquivo messages.txt
$("#deleteMessages").on('click', event => {
    event.preventDefault();

    Swal.fire({
        title: 'Deseja apagar as mensagens?',
        text: "Todas as mensagens serão apagadas definitivamente!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sim, apagar!'
      }).then((result) => {
        if (result.isConfirmed) {

            // apaga as mensagens do quadro
            $("#messages").children().remove()

            //envia o evento ao servidor para apagar as mensagens do txt
            socket.emit('deleteArchive', true)
            Swal.fire(
                'Deletado!',
                'Todas as mensagens foram apagadas.',
                'success'
            )
        }
      })
})

function populationMessage(message){
    $("#messages").append(`<div class="message"><strong>${message.author}: </strong>${message.message}</div>`)
}
