// console.log(arguments);
// console.log(require(("module").wrapper));

//module.exports
const C = require('./test.module-1');
const calc1 = new C();
console.log(calc1.add(2,5));

//exports
const calc2 = require('./test.module-2');
// another way
const {add, multiply ,devide} = require('./test.module-2');
console.log(calc2.multiply(2,5));

//chaching            calling the function
require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();
//we can see here that the module only loaded onces 


