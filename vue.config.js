const path = require('path')
const Copy = require('copy-webpack-plugin')
const Analyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// const PrerenderSpaPlugin = require('prerender-spa-plugin')

const resolve = pathname => path.resolve(__dirname, pathname)

const isProd = () => process.env.NODE_ENV === 'production'

const proxy = 'http://gcvin.herokuapp.com'

module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: proxy
  },
  outputDir: resolve(isProd() ? './src/server/public' : './dist'),
  configureWebpack: config => {
    // entry
    config.entry.app = './src/client/main'
    // resolve
    config.resolve.alias['@'] = resolve('./src/client')
    // externals
    config.externals = { pdfMake: 'pdfMake' }

    if (isProd()) {
      config.plugins.push(
        new Analyzer(),
        new Copy([{
          from: resolve('./src/client/public'),
          to: resolve('./src/server/public'),
          ignore: ['index.html', '.DS_Store']
        }])
        // new PrerenderSpaPlugin({
        //   staticDir: resolve('./src/server/public'),
        //   indexPath: resolve('./src/server/views/index.html'),
        //   routes: ['/'],
        //   server: {
        //     proxy: {
        //       '/ajax': proxy
        //     }
        //   }
        // })
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
