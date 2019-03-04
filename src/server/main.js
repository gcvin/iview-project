import path from 'path'
import Koa from 'koa'
import views from 'koa-views'
import logger from 'koa-logger'
import koaBody from 'koa-body'
import session from 'koa-session'
import serve from 'koa-static'
import { Wechaty } from 'wechaty'
import qrTerm from 'qrcode-terminal'

import router from './router'

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

const bot = new Wechaty()

const onScan = async function (qrcode) {
  qrTerm.generate(qrcode)
  console.log(qrcode)
}

const onMessage = async function (message) {
  const room = message.room()
  const contact = message.from()
  const text = message.text()
  const isRobot = text.startsWith('[小张]')

  if (!room) {
    return false
  }

  const topic = await room.topic()

  if (topic === '吃火锅学习交流群' && !contact.self()) {
    await room.say('[小张]春凤是我的，各位拔刀吧')
  }

  if (topic === '吃火锅学习交流群' && contact.self() && !isRobot) {
    await room.say('[小张]--我是张大爷的小尾巴^_^')
  }
}

bot.on('scan', onScan)
bot.on('message', onMessage)
bot.start()

export default app
