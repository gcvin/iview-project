import path from 'path'
import Koa from 'koa'
import views from 'koa-views'
import logger from 'koa-logger'
import koaBody from 'koa-body'
import session from 'koa-session'
import serve from 'koa-static'

import router from './router'
// import './wechat'

const app = new Koa()

app.keys = ['xiaozhang']

// view engine setup
app.use(views(path.join(__dirname, 'views'), { extension: 'ejs' }))

app.use(logger())
app.use(koaBody())
app.use(serve(path.join(__dirname, 'public'), { maxage: 24 * 60 * 60 * 1000 }))
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

const server = app.listen(process.env.PORT || 4000, _ => {
  const port = server.address().port
  console.log(`Server listening at http://localhost:${port}`)
})

export default app
