const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'reactActionListener',
    globalObject: 'this',
  },
  cache: true,
  optimization: {
    minimize: true,
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    redux: {
      root: 'Redux',
      commonjs2: 'redux',
      commonjs: 'redux',
      amd: 'redux',
    },
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx', '.json'],
    alias: {
      // Use library's node_modules react even library is linked via `npm link`
      react: path.resolve('./node_modules/react'),
    },
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
