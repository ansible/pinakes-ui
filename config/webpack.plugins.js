const path = require('path');
const webpack = require('webpack');
const config = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LodashWebpackPlugin = require('lodash-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

const plugins = [
  new WriteFileWebpackPlugin(),
  new HtmlWebpackPlugin({
    title: 'Catalog for ansible',
    filename: 'index.html',
    template: path.resolve(__dirname, '../src/index.html')
  }),
  new webpack.SourceMapDevToolPlugin({
    test: /\.js/i,
    exclude: /(node_modules|bower_components)/i,
    filename: `sourcemaps/[name].js.map`
  }),
  new LodashWebpackPlugin({
    currying: true,
    flattening: true,
    placeholders: true,
    paths: true
  }),
  new webpack.DefinePlugin({
    'process.env.BASE_PATH': JSON.stringify(process.env.BASE_PATH || '/api')
  }),
  new HtmlReplaceWebpackPlugin([
    {
      pattern: '@@env',
      replacement: config.appDeploy
    }
  ]),
  new WorkboxWebpackPlugin.GenerateSW({
    clientsClaim: true,
    exclude: [/\.map$/, /asset-manifest\.json$/],
    // navigateFallback: paths.publicUrlOrPath + 'index.html',
    navigateFallbackDenylist: [
      // Exclude URLs with hashes
      new RegExp('#'),
      // Exclude any URLs whose last part seems to be a file extension
      // as they're likely a resource and not a SPA route.
      // URLs containing a "?" character won't be blacklisted as they're likely
      // a route with query params (e.g. auth callbacks).
      new RegExp('/[^/?]+\\.[^/]+$'),
      // For now exclude any API calls
      // we might want use staleWhileRevalide or networkFirst strategy for entitlements or rbac permissions later
      new RegExp(/\/api\//)
    ]
  })
];

module.exports = plugins;
