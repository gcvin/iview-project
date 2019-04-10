const path = require('path')
const Koa = require('koa')
const views = require('koa-views')
const logger = require('koa-logger')
const koaBody = require('koa-body')
const session = require('koa-session')
const serve = require('koa-static')

// const wechat = require('./wechat')
const router = require('./router')

const app = new Koa()
const http = require('http').Server(app.callback())
// const io = require('socket.io')(http)

app.keys = ['xiaozhang']

app.use(views(path.join(__dirname, 'views'), { extension: 'ejs' }))

app.use(logger())
app.use(koaBody())
app.use(serve(path.join(__dirname, 'public')))
app.use(session(app))

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    await ctx.render('error', {
      message: err.message,
      error: err
    })
  }
})

app.use(router.routes())

// io.on('connection', function (socket) {
//   wechat(socket)
// })

const server = http.listen(process.env.PORT || 4000, _ => {
  const port = server.address().port
  console.log(`Server listening at http://localhost:${port}`)
})

module.exports = app
