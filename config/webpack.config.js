const merge = require('webpack-merge');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
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
    chunkFilename: 'js/[name].js',
    path: common.paths.public,
    publicPath: common.paths.publicPath
  },
  module: {
    rules: [
      {
        test: /src\/.*\.js$/,
        exclude: /node_modules/,
        use: [{ loader: 'source-map-loader' }, { loader: 'babel-loader' }]
      },
      {
        test: /\.s?[ac]ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(woff(2)?|ttf|jpg|png|eot|gif|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      },
      {
        parser: {
          amd: false
        }
      }
    ]
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
  const common = commonConfig;
  if (env.analyze === 'true') {
    common.plugins.push(new BundleAnalyzerPlugin());
  }

  if (env.prod === 'true') {
    return common;
  }

  return merge(common, devConfig);
};
