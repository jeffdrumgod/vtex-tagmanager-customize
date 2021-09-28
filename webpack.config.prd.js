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
    environment: {
      arrowFunction: false,
      bigIntLiteral: false,
      const: false,
      destructuring: false,
      dynamicImport: false,
      forOf: false,
      module: false,
    },
  },
  watch: false,
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  optimization: {
    // We no not want to minimize our code.
    minimize: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /(node_modules)/,
        use: [
          {
            options: {
              useTranspileModule: true,
              forceIsolatedModules: true,
              useCache: true,
              useBabel: true,
              babelOptions: {
                babelrc: true /* Important line */,
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      targets: {
                        ie: '11',
                      },
                      useBuiltIns: 'entry',
                    },
                  ],
                ],
                plugins: [
                  '@babel/transform-async-to-generator',
                  '@babel/transform-arrow-functions',
                  '@babel/transform-modules-commonjs',
                ],
              },
              reportFiles: ['src/**/*.{ts,tsx}'],
              babelCore: '@babel/core',
            },
            loader: 'awesome-typescript-loader',
          },
        ],
      },
    ],
  },
};
