// Webpack uses this to work with directories
const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// This is main configuration object.
// Here you write different options and tell Webpack what to do
module.exports = {

  // Path to your entry point. From this file Webpack will begin his work
  entry: './src/index.js',

  // Path and filename of your result bundle.
  // Webpack will bundle all JavaScript into this file
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },

  module: {
    rules: [
        {
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        },
        {
            test: /\.css$/,
            exclude: /(node_modules)/,
            use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          loader:'file-loader'
        },
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
        template: './index.html',
        minify: {
            removeComments: true,
            collapseWhiteSpaces: true,
            removeAttributeQuotes: true
        },
    }),
    new MiniCssExtractPlugin({
        filename: '[name].css',
        chunckFilename: '[id].css'
    })
  ],
  devServer: {
    contentBase: './dist',
    port: 8080,
  },
  // Default mode for Webpack is production.
  // Depending on mode Webpack will apply different things
  // on final bundle. For now we don't need production's JavaScript 
  // minifying and other thing so let's set mode to development
  mode: 'development'
};