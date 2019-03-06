import apiai from 'apiai'
import qr from 'qr-image'
import { Wechaty, Message } from 'wechaty'

export default (socket) => {
  const key = '7217d7bce18c4bcfbe04ba7bdfaf9c08'

  const app = apiai(key)
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
      if (await room.topic() !== topic) {
        return false
      }
      const request = app.textRequest(text, { sessionId: contact })
      request.on('response', function (response) {
        room.say(response.result.fulfillment.speech)
      })
      request.on('error', function () {
        room.say('我不知道你在说什么呢')
      })
      request.end()
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
