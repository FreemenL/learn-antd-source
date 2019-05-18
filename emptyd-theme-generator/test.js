const hash = require("hash.js");

const test = hash.sha256().update('ab').digest('hex');

console.log(test);