const fs = require('fs');

const data = fs.readFileSync('./data_test.txt', 'utf8');
console.log(data);  

const training_tokenizer_json = JSON.parse(fs.readFileSync('./training_tokenizer.json', 'utf8'));
const label_tokenizer_json = JSON.parse(fs.readFileSync('./label_tokenizer.json', 'utf8'));


console.log(training_tokenizer_json)