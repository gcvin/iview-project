import { Wechaty, Message } from 'wechaty'
import qrTerm from 'qrcode-terminal'
import ApiAi from 'apiai'

const ROOM_TOPIC = '吃火锅学习交流群'
const APIAI_API_KEY = '7217d7bce18c4bcfbe04ba7bdfaf9c08'

const app = ApiAi(APIAI_API_KEY)
const bot = new Wechaty()

let chatting = false

const onScan = qrcode => {
  qrTerm.generate(qrcode, { small: true })
}

const onMessage = async message => {
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

  if (await room.topic() !== ROOM_TOPIC) {
    return false
  }

  const request = app.textRequest(text, { sessionId: contact })

  request.on('response', function (response) {
    room.say(response.result.fulfillment.speech)
  })

  request.end()
}

bot.on('scan', onScan)
bot.on('message', onMessage)
bot.start()
