'use-strict'

var params = process.argv.slice(2);

var n1 = parseFloat(params[0]);
var n2 = parseFloat(params[1]);

var plantilla = `
    La suma es: ${n1 + n2} \n
    La resta es: ${n1 - n2} \n
    La multiplicación es: ${n1 * n2} \n
    La división es: ${n1 / n2} \n
    `
console.log(plantilla)
console.log("Hola mundo con NodeJs");