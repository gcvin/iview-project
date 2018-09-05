const path = require('path')
const webpack = require('webpack')
const Copy = require('copy-webpack-plugin')
const Visualizer = require('webpack-visualizer-plugin')

const resolve = pathname => path.resolve(__dirname, pathname)

const isProd = () => process.env.NODE_ENV === 'production'

module.exports = {
    lintOnSave: false,
    devServer: {
        proxy: 'http://localhost:4000'
    },
    outputDir: resolve(isProd() ? './src/server/public' : './dist'),
    configureWebpack: config => {
        // entry
        config.entry.app = './src/client/main'
        config.entry.vendor = './src/client/vendor'
        // resolve
        config.resolve.alias['@'] = resolve('./src/client')
        // plugin
        config.plugins.push(
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery'
            })
        )

        if (isProd()) {
            config.plugins.push(
                new Visualizer({
                    filename: '../views/stats.ejs' // 相对于output.path
                }),
                new Copy([{
                    from: resolve('./src/client/public'),
                    to: resolve('./src/server/public'),
                    ignore: ['index.ejs', '.DS_Store']
                }])
            )
        }
    },
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(([args]) => [Object.assign(args, {
                template: resolve('./src/client/public/index.ejs'),
                filename: isProd() ? resolve('./src/server/views/index.ejs') : 'index.html'
            })])
    }
}
