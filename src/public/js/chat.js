const socket = io()
let user
let chatBox = document.querySelector('#chatBox')
function isValidEmail(email){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

Swal.fire({
    title: 'Identifícate',
    input: 'email',
    inputAttributes: {
        autocapitalize: 'off'
    },
    text: 'Ingresa el usuario para identificarte en el chat',
    confirmButtonText: 'Enviar',
    inputValidator: (value) => {
        if (!value || !isValidEmail(value)){
            return 'Necesitas escribir un email válido para continuar'
        } 
    },
    allowOutsideClick: false
})
.then(result =>{
    user = result.value
})

chatBox.addEventListener('keyup', evt => {
    if(evt.key === 'Enter'){
        if(chatBox.value.trim().length > 0){
            socket.emit('message', { user: user, message: chatBox.value});
            chatBox.value = ''
        }
    }
})

socket.on('messageLogs', data => {
    let log = document.getElementById('messageLog');
    let messages = '';
    data.forEach(message => {
        messages = messages + `${message.user} dice: ${message.message} </br>`
    })
    log.innerHTML = messages
})