import qr from 'qr-image'
import Tuling from 'tuling123-client'
import { Wechaty, Message } from 'wechaty'

export default (socket) => {
  const key = '470f90cf381540cf81ce8a632e68be2f'

  const app = new Tuling(key)
  const bot = new Wechaty()

  const onScan = (qrcode, code) => {
    const buffer = qr.imageSync(qrcode, { type: 'png' })
    const data = buffer.toString('base64')
    const image = 'data:image/png;base64,' + data
    socket.emit('scan', image, code)
  }

  const onLogin = user => {
    socket.emit('login', user)
  }

  const onMessage = (topic) => {
    let chatting = false

    return async message => {
      const room = message.room()
      const contact = message.from()
      const type = message.type()
      const text = message.text()
      const self = message.self()

      if (await room.topic() !== topic) {
        return false
      }
      if (text === '你好小张') {
        chatting = true
        room.say('来啦？老弟。')
        return false
      }
      if (text === '再见小张') {
        chatting = false
        room.say('带上小张的祝福，滚的越远越好。')
        return false
      }
      if (self || !chatting || !room || type !== Message.Type.Text) {
        return false
      }
      const reply = await app.ask(text, { userid: contact })
      await room.say(reply.text)
    }
  }

  bot.on('scan', onScan)
  bot.on('login', onLogin)
  bot.start()

  socket.on('start', (topic) => {
    bot.on('message', onMessage(topic))
  })

  socket.on('stop', async () => {
    if (bot.logonoff()) {
      await bot.logout()
    }
    await bot.start()
  })

  socket.on('destroy', async () => {
    if (bot.logonoff()) {
      await bot.logout()
    }
    await bot.stop()
  })
}
