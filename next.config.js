var extractTextPlugin = require('extract-text-webpack-plugin');
var generateScopedName = require('./build/createUniqueIdGenerator').generateScopedName;
var path = require('path');
var ROOT_PATH = path.resolve(__dirname);

module.exports = {
  webpack: (config, { dev }) => {
    config.module.rules.push(
      {
        test: /\.css$/,
        use: 'css-loader'
        // use: extractTextPlugin.extract({
        //   // fallback: "style-loader",
        //   use: "css-loader"
        // })
      },
      // {
      //   test: /\.scss$/,
      //   use: [
      //     'style-loader',
      //     {
      //       loader: 'css-loader',
      //       options: {
      //         camelCase: true,
      //         getLocalIdent: (context, localIdentName, localName) => {
      //           return generateScopedName(localName, context.resourcePath);
      //         },
      //         importLoaders: 1,
      //         minimize: true,
      //         modules: true
      //       }
      //     },
      //     'resolve-url-loader',
      //     'sass-loader',
      //   ]
      // }
    );
    config.resolve = {
      extensions: ['.web.js', '.js', '.json', '.jsx'],
      alias: {
        // Support React Native Web
        // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
        // 'react-native': 'react-native-web',
        // ================================
        // 自定义路径别名
        // ================================
        Module: path.resolve(ROOT_PATH,'public/module'),
        Api: path.resolve(ROOT_PATH,'public/api'),
        Img: path.resolve(ROOT_PATH,'public/img'),
      }
    }
    return config;
  }
}
