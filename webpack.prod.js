const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxSize: 70000,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      automaticNameDelimiter: '~',
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new webpack.DefinePlugin({
      'IS_DEVELOPMENT': JSON.stringify(false),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/public/offline.html'),
          to: path.resolve(__dirname, 'dist'),
        },
        {
          from: path.resolve(__dirname, 'src/public/icons'),
          to: path.resolve(__dirname, 'dist/icons'),
        },
        {
          from: path.resolve(__dirname, 'src/public/screenshots'),
          to: path.resolve(__dirname, 'dist/screenshots'),
        },
        {
          from: path.resolve(__dirname, 'src/public/favicon.png'),
          to: path.resolve(__dirname, 'dist'),
        },
        {
          from: path.resolve(__dirname, 'src/public/manifest.json'),
          to: path.resolve(__dirname, 'dist'),
        },
        {
          from: path.resolve(__dirname, 'src/public/images'),
          to: path.resolve(__dirname, 'dist/images'),
        },
      ],
    }),
    new InjectManifest({
      swSrc: path.resolve(__dirname, 'src/public/sw.js'),
      swDest: 'sw.js',
    }),
  ],
});