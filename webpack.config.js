const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  // កែ entry point ទៅតាម file JS ចម្បងរបស់អ្នក (បើមិនមាន src/index.js ទេ អាចប្រើ ./assets/js/auth.js ឬ entry ពិតប្រាកដ)
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: './',
    // ប្រុងប្រយ័ត្ន៖ ដាក់ clean: false ដើម្បីកុំឱ្យ Webpack លុប file ផ្សេងៗក្នុង public/ ដែលមិនបានគ្រប់គ្រងដោយ Webpack
    clean: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      inject: 'body',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'glreports.html',
          to: 'glreports.html',
          noErrorOnMissing: true,
        },
        {
          from: 'assets',
          to: 'assets',
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
};
