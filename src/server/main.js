import path from 'path'
import Koa from 'koa'
import views from 'koa-views'
import logger from 'koa-logger'
import koaBody from 'koa-body'
import session from 'koa-session'
import serve from 'koa-static'

import wechat from './wechat'
import router from './router'

const app = new Koa()
const http = require('http').Server(app.callback())
const io = require('socket.io')(http)

app.keys = ['xiaozhang']

// view engine setup
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

io.on('connection', function (socket) {
  console.log('user connected')
  socket.on('disconnect', function () {
    console.log('user disconnected')
  })

  wechat(socket)
})

const server = http.listen(process.env.PORT || 4000, _ => {
  const port = server.address().port
  console.log(`Server listening at http://localhost:${port}`)
})

export default app
