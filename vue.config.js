const path = require('path')
const Copy = require('copy-webpack-plugin')
const Analyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// const PrerenderSpaPlugin = require('prerender-spa-plugin')

const resolve = pathname => path.resolve(__dirname, pathname)

const isProd = () => process.env.NODE_ENV === 'production'

const proxy = 'https://gcvin.herokuapp.com'

module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    proxy: proxy
  },
  outputDir: resolve(isProd() ? './src/server/public' : './dist'),
  configureWebpack: config => {
    config.entry.app = './src/client/main'
    config.resolve.alias['@'] = resolve('./src/client')
    config.externals = {
      'vue': 'Vue',
      'iview': 'iview',
      'vue-router': 'VueRouter',
      'pdfMake': 'pdfMake',
      'html2canvas': 'html2canvas',
      'videojs': 'videojs'
    }

    if (isProd()) {
      config.plugins.push(
        new Analyzer({
          analyzerMode: 'disabled'
        }),
        new Copy([{
          from: resolve('./src/client/public'),
          to: resolve('./src/server/public'),
          ignore: ['index.html', '.DS_Store']
        }])
        // new PrerenderSpaPlugin({
        //   staticDir: resolve('./src/server/public'),
        //   outputDir: resolve('./src/server/views'),
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
  },
  pwa: {
    themeColor: '#5bbad5',
    msTileColor: '#00aba9',
    iconPaths: {
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/mstile-144x144.png'
    }
  }
}
