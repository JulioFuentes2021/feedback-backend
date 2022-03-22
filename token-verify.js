const jwt = require('jsonwebtoken');

const secret = 'myCat'//!No deberia de estar en codigo, deberia de estar como una variable de entorno
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInNjb3BlIjoiIiwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNjQ3OTc3MDY2fQ.vIp3Yz57MCY1YiNAS6Qwn9a0xYd-t3jDloYXHG4SzUk'

//*Es lo que vamos a encriptar dentro dle token
// const payload = {
//     //Forma en la que vamos a identificar el usuario
//     sub: 1,
//     scope: '',//permisos
//     role: 'customer'
// }

function verifyToken(token, secret) {
    return jwt.verify(token, secret)
}

const payload = verifyToken(token, secret);
console.log(payload);
