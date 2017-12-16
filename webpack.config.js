const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	entry: {
		'express-pagination': './src/index.ts',
		'express-pagination.min': './src/index.ts'
	},
	output: {
		path: path.resolve(__dirname, 'dist/umd'),
		filename: '[name].js',
		libraryTarget: 'umd',
		library: 'expressPagination',
		umdNamedDefine: true
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
		modules: ["node_modules"]
	},
	devtool: 'source-map',
	plugins: [
		new UglifyJsPlugin({
			sourceMap: true,
			include: /\.min\.js$/
		})
	],
	module: {
		loaders: [{
			test: /\.tsx?$/,
			loader: 'awesome-typescript-loader',
			exclude: /node_modules/,
			query: {
				declaration: false
			}
		}]
	}
};