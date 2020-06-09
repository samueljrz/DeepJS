const fs = require('fs');
const util = require('util');

const readFilePromise = util.promisify(fs.readFile)
const fileContent = fs.readFileSync(__filename);
console.log('filename: ', String(fileContent))
console.log('1');

readFilePromise(__filename).then(fileData => console.log(fileData))
/*
fs.readFile(__filename, (err, data) => {
    if(err) {
        console.log(err)
    }
    console.log('async fileContent', String(data));
})*/
console.log('2');

//stack é o lugar central onde o codigo é executado
// event loop é a troca de task entre a tasck queue e a stack


// init = new Promise(resolve, reject) {
//    ...
//}