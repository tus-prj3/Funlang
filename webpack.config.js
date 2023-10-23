const path = require('path')

module.exports = {
  mode: 'development',
  entry: './ts/index.ts',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
    publicPath: '/'
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader'
    }]
  },
  resolve: {
    modules: [
      'node_modules'
    ],
    extensions: [
      '.ts',
      '.js'
    ]
  },
  devServer: {
    static: './dist',
    hot: true,
    port: 8100
  }
}
