const express = require('express');
const nunjucks  = require('nunjucks');

const app = express();

nunjucks.configure('views',{autoescape:true,express:app});

app.get('/',(req,res)=>{
  res.render('index.html',{name:'postsbird==','title':'nunjucks'});
});

app.listen(8080,()=>{
    console.log("server start...");
});