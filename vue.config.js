const path = require('path')
const webpack = require('webpack')
const Visualizer = require('webpack-visualizer-plugin')

const resolve = pathname => path.resolve(__dirname, pathname)

module.exports = {
    lintOnSave: false,
    devServer: {
        proxy: 'http://localhost:4000'
    },
    configureWebpack: config => {
        let prod = process.env.NODE_ENV === 'production'

        // entry
        config.entry.app = './src/client/main'
        config.entry.vendor = './src/client/vendor'
        // output
        config.output.path = resolve(prod ? './src/server/public' : './')
        // resolve
        config.resolve.alias['@'] = resolve('./src/client')
        // plugin
        config.plugins.push(
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery'
            })
        )

        if (prod) {
            config.plugins.push(
                new Visualizer({
                    filename: '../views/stats.ejs' // 相对于output.path
                })
            )
        }
    },
    chainWebpack: config => {
        let prod = process.env.NODE_ENV === 'production'

        config
            .plugin('html')
            .tap(([args]) => [Object.assign(args, {
                template: resolve('./src/client/public/index.ejs'),
                filename: prod ? resolve('./src/server/views/index.ejs') : 'index.html'
            })])

        if (prod) {
            config
                .plugin('copy')
                .tap(([[args]]) => [[Object.assign(args, {
                    from: resolve('./src/client/public'),
                    to: resolve('./src/server/public'),
                    ignore: ['index.ejs', '.DS_Store']
                })]])
        }
    }
}
