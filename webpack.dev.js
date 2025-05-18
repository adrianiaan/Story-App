const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common');
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    open: true,
    port: 9000,
    client: {
      overlay: {
        errors: true,
        warnings: true,
      },
    },
    compress: true,
    // Tambahkan konfigurasi untuk service worker
    devMiddleware: {
      writeToDisk: true, // Ini memastikan file ditulis ke disk, penting untuk service worker
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
    ],
  },
  // Tambahkan plugin untuk menandai mode development
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'IS_DEVELOPMENT': JSON.stringify(true),
    }),
  ],
});