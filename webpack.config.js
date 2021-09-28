const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    'head-top': './src/js/head-top.ts',
    'head-bottom': './src/js/head-bottom.ts',
    'head-checkout': './src/js/head-checkout.ts',
  },
  output: {
    filename: 'tagmanager-customize-[name].min.js',
    path: path.resolve(__dirname, 'dist', 'arquivos'),
  },
  watch: true,
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  optimization: {
    // We no not want to minimize our code.
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /(node_modules)/,
        use: ['babel-loader', 'awesome-typescript-loader'],
      },
    ],
  },
};
