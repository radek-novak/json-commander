const path = require('path')

module.exports = {
    devtool: 'cheap-module-source-map',
    entry: {
        content: "./extension/src/js/content.js",
        background: "./extension/src/js/background.js"
    },
    output: {
        path: path.join(__dirname, "extension/build"),
        filename: "[name].js"
    },
    resolve: {
      extensions: ['', '.js', '.json', '.scss', '.css']
    },
    module: {
        loaders: [
          {
            test: /\.css$/,
            loaders: ['raw']
          },
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loaders: ['babel'],
          },
          {
            test: /\.json/,
            loaders: ["json"]
          }
        ]
    },
    node: {
      fs: "empty"
    }
}
