const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/widget/widgetEntry.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'form-widget.js',
    library: 'FormWidget',
    libraryTarget: 'umd',
    globalObject: 'this',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  externals: {
    // Don't bundle React/ReactDOM, but for a truly standalone widget, you may want to remove this
    // react: 'React',
    // 'react-dom': 'ReactDOM',
  },
}; 