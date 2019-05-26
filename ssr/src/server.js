import express from 'express';
import fetch from 'isomorphic-fetch';
import React from 'react';
import ReactDOM from 'react-dom/server';
import App from './app';
import template from './template';

const app = express();

//指定静态资源路径为客户端打包文件的路径
app.use(express.static('dist/public'));

app.get('/', (req, res) => {
    fetch('https://api.github.com/users/gaearon/gists')
    .then(response => response.json())
    .then(gists=>{
        const body = ReactDOM.renderToString(<App gists={ gists } />);
        const html = template(body,gists)
        res.send(html);
    })
})

app.listen(3000, () => {
    console.log("server start....");
});
