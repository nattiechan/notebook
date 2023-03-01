const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Add custom .env variable to `process.env`
require('dotenv').config();

module.exports = {
    entry: ['./client/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: 'bundle.js',
    },
    mode: process.env.NODE_ENV ? process.env.NODE_ENV : process.env.DEFAULT_ENV,
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'),
            publicPath: '/',
        },
        port: process.env.SERVER_PORT,
        historyApiFallback: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        proxy: { '/orders': 'http://localhost:3000/' }
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