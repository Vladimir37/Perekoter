var path = require('path');
var webpack = require('webpack');

module.exports = {
    context: __dirname + '/..',

	entry: './src/scripts/index.jsx',

	output: {
		path: path.join(__dirname, 'files/builds'),
        filename: "scripts.js"
	},

    module: {
        loaders: [{
            test: /\.jsx$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015', 'react']
            }
        }]
    },

    plugins: [
        new webpack.NoErrorsPlugin()
    ],
};