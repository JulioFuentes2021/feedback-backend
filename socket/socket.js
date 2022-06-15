

const socket = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected paaa', socket.id);
        console.log('User connected paaa', socket.connected);


        socket.on('test', (name) => {
            console.log(`El usuario del cliente ${name}`)
        })

        socket.on('addUpvote', (callback) => {
            console.log('El socket addUpvote esta funcionando...')
            socket.emit('client')
        })

    })

}

module.exports = socket