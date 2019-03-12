import qr from 'qr-image'
import Tuling from 'tuling123-client'
import { Wechaty, Message } from 'wechaty'

export default (socket) => {
  const key = '470f90cf381540cf81ce8a632e68be2f'

  const app = new Tuling(key)
  const bot = new Wechaty()

  const onScan = (qrcode, code) => {
    const buffer = qr.imageSync(qrcode, { type: 'png', size: 10 })
    const data = buffer.toString('base64')
    const image = 'data:image/png;base64,' + data
    socket.emit('scan', image, code)
  }

  const onLogin = user => {
    socket.emit('login', user)
  }

  const onMessage = (params) => {
    let chatting = !params.cmd

    return async message => {
      const to = message.to()
      const room = message.room()
      const from = message.from()
      const type = message.type()
      const text = message.text()
      const self = message.self()
      const prefix = params.self ? `(${params.name})` : ''
      const robot = self && text.startsWith(prefix)
      let tosay = null

      if (params.type === 'room') {
        if (!room) {
          return false
        }
        if (await room.topic() === params.topic) {
          tosay = room
        }
      }
      if (params.type === 'friend') {
        const fromName = from.name()
        const toName = to && to.name()

        if (room) {
          return false
        }
        if (!self && fromName === params.friend) {
          tosay = from
        }
        if (self && toName === params.friend) {
          tosay = to
        }
      }
      if (!tosay) {
        return false
      }
      if (params.cmd && text === params.open) {
        chatting = true
        tosay.say(prefix + params.hello)
        return false
      }
      if (params.cmd && text === params.close) {
        chatting = false
        tosay.say(prefix + params.bye)
        return false
      }
      if (robot || !chatting || type !== Message.Type.Text) {
        return false
      }
      const reply = await app.ask(text, { userid: from })
      await tosay.say(prefix + reply.text)
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
