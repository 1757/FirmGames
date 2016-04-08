/* global __dirname */

const path = require('path');
const webpack = require('webpack');

const dirJs = path.resolve(__dirname, 'src');
const dirBuild = path.resolve(__dirname, 'build');
const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

module.exports = {
  entry: path.resolve(dirJs, 'main.jsx'),
  output: {
    path: dirBuild,
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: dirBuild,
    historyApiFallback: true,
  },
  module: {
    loaders: [
      {
        include: [dirJs],
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file-loader',
      },
    ],
  },
  plugins: [
    // Avoid publishing files when compilation fails
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `"${NODE_ENV}"`,
      },
    }),
  ],
  stats: {
    // Nice colored output
    colors: true,
  },
  // Create Sourcemaps for the bundle
  devtool: 'source-map',
  resolve: {
    alias: {
      src: dirJs,
    },
    extensions: ['', '.js', '.jsx'],
  },
};
