const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Add custom .env variable to `process.env`
require('dotenv').config();
console.log(process.env.SERVER_PORT);

module.exports = {
    entry: ['./client/index.js'],
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: 'bundle.js',
    },
    mode: process.env.NODE_ENV ? process.env.NODE_ENV : process.env.DEFAULT_ENV,
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
            publicPath: '/',
        },
        port: process.env.SERVER_PORT,
        proxy: { '/api': 'http://localhost:3000' }
    },
    module: {
        rules: [
            {
                test: /.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: { presets: ['@babel/preset-env', '@babel/preset-react'] }
                }
            }, {
                test: /.s?css$/,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './client/index.html' })
    ],
    resolve: {
        extensions: ['.js', '.jsx']
    }
}