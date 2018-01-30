let path = require('path');
var S3Plugin = require('webpack-s3-plugin')

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: {
    'bundle': ['babel-polyfill', './index.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dest')
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
    /*new S3Plugin({
      include: /.*\.(css|js|html)/,
      // s3Options are required
      s3Options: {
        region: 'us-east-1',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      s3UploadOptions: {
        Bucket: 'mesh-dev-site'
      },
      basePath: 'oauth/dest'
    })*/
  ],
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
