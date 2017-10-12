let path = require('path');

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: ['babel-polyfill', './index.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dest')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
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
  devServer: {
    publicPath: "/dest",
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

