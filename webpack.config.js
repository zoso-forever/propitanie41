const path = require('path');
const webpack = require('webpack');

const resolve = dir => path.resolve(__dirname, dir);
const isProduction = process.env.NODE_ENV === 'production';

const config = {
    entry: {
        main: './src/scripts/main.js',
        common: './src/scripts/common.js',
        cart: './src/scripts/cart.js'
    },
    output: {
        path: resolve('dist/js'),
        filename: '[name].min.js'
    },
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@': resolve('src/scripts'),
            'vue$': 'vue/dist/vue.runtime.esm.js',
            '@template': resolve('src/template'),
            'process': 'process/browser'
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [resolve('src')],
                options: {
                    formatter: require('eslint-friendly-formatter'),
                    emitWarning: true

                }
            },
            {
                test: /\.html$/,
                use: 'vue-template-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src')]
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser'
        })
    ]
};

module.exports = () => {
    if (!isProduction) {
        config.devtool = 'eval-cheap-module-source-map';
        config.mode = 'development';
    }

    if (process.env.npm_config_report) {
        const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
        config.plugins.push(new BundleAnalyzerPlugin());
    }

    return config;
};
