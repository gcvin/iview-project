const path = require('path')
const Copy = require('copy-webpack-plugin')
const Visualizer = require('webpack-visualizer-plugin')
const PrerenderSpaPlugin = require('prerender-spa-plugin')

const resolve = pathname => path.resolve(__dirname, pathname)

const isProd = () => process.env.NODE_ENV === 'production'

module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: 'http://gcvin.herokuapp.com'
  },
  outputDir: resolve(isProd() ? './src/server/public' : './dist'),
  configureWebpack: config => {
    // entry
    config.entry.app = './src/client/main'
    config.entry.vendor = './src/client/vendor'
    // resolve
    config.resolve.alias['@'] = resolve('./src/client')

    if (isProd()) {
      config.plugins.push(
        new Visualizer({
          filename: '../views/stats.html' // 相对于output.path
        }),
        new Copy([{
          from: resolve('./src/client/public'),
          to: resolve('./src/server/public'),
          ignore: ['index.html', '.DS_Store']
        }]),
        new PrerenderSpaPlugin({
          staticDir: resolve('./src/server/public'),
          indexPath: resolve('./src/server/views/index.html'),
          routes: ['/'],
          server: {
            proxy: {
              '/ajax': 'http://localhost:4000'
            }
          }
        })
      )
    }
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(([args]) => [Object.assign(args, {
        template: resolve('./src/client/public/index.html'),
        filename: isProd() ? resolve('./src/server/views/index.html') : 'index.html'
      })])
  }
}
