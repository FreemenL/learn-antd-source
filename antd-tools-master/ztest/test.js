const through2 = require("through2");  //对 stream 架设一层拦截  
const fs = require("fs");
const csv2 = require("csv2"); // 将解析输入字符流并为每行CSV数据传递一个数组

// fs.createReadStream('ex.txt')
// .pipe(through2(function (chunk, enc, callback) {
// for (var i = 0; i < chunk.length; i++)
//   	console.log(chunk[i])
// 	this.push(chunk)
// 	callback()
// }))
// .pipe(fs.createWriteStream('out.txt'))
// .on('finish', () => {
// 	console.log("finish...")
// })
// 

var all = []
 
fs.createReadStream('ex.txt')
.pipe(csv2())
.pipe(through2.obj(function (chunk, enc, callback) {
	var data = {
	    name    : chunk[0]
	  , address : chunk[1]
	  , phone   : chunk[2]
	}
	this.push(data)
	callback()
}))
.on('data', (data) => {
	all.push(data)
})
.on('end', () => {
   var out = fs.createWriteStream('out.txt', {
	  encoding: 'utf8'
   });
   out.write(JSON.stringify(all));
})

