const jwt = require('jsonwebtoken');

const secret = 'myCat'//!No deberia de estar en codigo, deberia de estar como una variable de entorno

//*Es lo que vamos a encriptar dentro dle token
//!Una recomendacion muy importante es no guardar informacion sensibles como: mail, password, key de servicio. 
const payload = {
    //Forma en la que vamos a identificar el usuario
    sub: 1,
    scope: '',//permisos
    role: 'customer'
}

function signToken(payload, secret) {
    return jwt.sign(payload, secret)
}

const token = signToken(payload, secret);
console.log(token);
