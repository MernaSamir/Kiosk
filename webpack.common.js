var path = require('path');
require('style-loader/lib/addStyles');
require('css-loader/lib/css-base');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// var nodeExternals = require('webpack-node-externals');


module.exports = {
    // externals: [nodeExternals()],
    entry: {
        vendor: ['babel-polyfill', 'react', 'react-dom', 'redux', 'react-redux'],
        common: './src/index.js'
    },
    resolve:{
      alias: { 
        '@assets': path.resolve(__dirname, 'src/assets')
      },
    },
    output: {
        filename: '[name].min.js',
        chunkFilename: '[name].min.js',
        umdNamedDefine: true,
        publicPath: "js/dist/",
        path: path.resolve(__dirname, 'www/js/dist')
    },
    node: {
      fs: 'empty'
    },
    module: {
        noParse: /gun\.js$/,
        rules: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              use: ["babel-loader"]
            },
            {
              test: /antd.*\.less$/,
              use: [
                { loader: "style-loader" },
                { loader: "css-loader" },
                {
                  loader: "less-loader",
                  options: {
                    javascriptEnabled: true,
                    // modifyVars: themeVariables
                    modifyVars: {
                     'primary-color': '#d73f7c'
                   },
                  }
                }
              ]
            },
            {
              test: /\.less$/,
              exclude: /(node_modules|bower_components)/,
              use: [
                { loader: "style-loader" },
                {
                  loader: "css-loader",
                  options: {
                    modules: true
                  }
                },
                {
                  loader: "less-loader",
                  options: {
                    javascriptEnabled: true
                  }
                }
              ]
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            },
            {
              test: /\.css$/,
              use: [{ loader: "style-loader" }, { loader: "css-loader" }]
            },
            {
              test: /\.html$/,
              use: [
                {
                  loader: "html-loader"
                }
              ]
            }
          ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // all options are optional
        filename: '[name].css',
        chunkFilename: '[id].css',
        ignoreOrder: false, // Enable to remove warnings about conflicting order
      }),
    ],
    optimization: {
      // runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: { default: false } ,
        chunks: 'async',
        minSize: 30000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 10,
        maxInitialRequests: 10,
        automaticNameDelimiter: '~',
        // automaticNameMaxLength: 30,
        name: true,
      },
    },
    
}
