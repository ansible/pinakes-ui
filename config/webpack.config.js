const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const plugins = require('./webpack.plugins.js');

const common = require('./webpack.common.js');

const commonConfig = {
  resolve: {
    alias: {
      react: path.resolve(__dirname, '../node_modules/react')
    }
  },
  entry: {
    App: common.paths.entry
  },
  output: {
    filename: 'js/[name].js',
    path: common.paths.public,
    publicPath: common.paths.publicPath
  },
  module: {
    rules: [{
      test: /src\/.*\.js$/,
      exclude: /node_modules/,
      use: [{ loader: 'source-map-loader' }, { loader: 'babel-loader' }]
    }, {
      test: /\.s?[ac]ss$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader'
        },
        {
          loader: 'sass-loader'
        }
      ]
    }, {
      test: /\.(woff(2)?|ttf|jpg|png|eot|gif|svg)(\?v=\d+\.\d+\.\d+)?$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts/'
        }
      }]
    }, {
      parser: {
        amd: false
      }
    }]
  },
  plugins
};

const devConfig = {
  devServer: {
    contentBase: path.join(__dirname, '../dist'),
    port: 8002,
    https: true,
    historyApiFallback: true,
    hot: false,
    inline: false,
    disableHostCheck: true
  }
};

module.exports = function(env) {
  if (env.prod === 'true') {
    return commonConfig;
  }

  return merge(commonConfig, devConfig);
};
