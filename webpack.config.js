let path = require('path');

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: {
    'bundle': ['babel-polyfill', './index.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [
          /(node_modules|bower_components)/
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ],
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  resolve: {
    alias: {
        querystring: 'querystring-browser'
      }    
  },
  plugins: [

  ],
  devServer: {
    publicPath: "/dist",
    contentBase: path.join(__dirname, "/"),
    //hot:true,
    headers: {
      "Access-Control-Allow-Origin": '*'
    },
    proxy: {
      "/oauth2callback": {
        target: "http://localhost:8080",
        pathRewrite: {"^/oauth2callback" : "/"}
      }
    }
  }
}
