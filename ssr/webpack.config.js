//服务端忽略某些包
const nodeExternals = require('webpack-node-externals')
const path = require("path");

const loaders = [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react'],
      }
}]

// 客户端配置
const client = {
    entry: './src/client.js',
    output: {
      path: path.join(__dirname,'./dist/public'),
      filename: 'bundle.js',
    },
    module: { loaders },
    plugins:[]
}

// server 端配置
const server = {
    entry: './src/server.js',
    output: {
      path: path.join(__dirname,'./dist'),
      filename: 'server.js',
    },
    module: { loaders },
    //告诉 Webpack 忽略 Node.js的所有内置系统包
    target: 'node',
    externals: [ nodeExternals() ],
    plugins:[]
}

module.exports = [ client, server ] ;