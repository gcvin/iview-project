import { Wechaty, Message } from 'wechaty'
import qrTerm from 'qrcode-terminal'
import Robot from 'tuling123-client'

const bot = new Wechaty()
const TULING123_API_KEY = '470f90cf381540cf81ce8a632e68be2f'
const robot = new Robot(TULING123_API_KEY)

let startChat = false

const onScan = function (qrcode) {
  qrTerm.generate(qrcode)
}

const onMessage = async function (message) {
  const room = message.room()
  const contact = message.from()
  const type = message.type()
  const text = message.text()
  const self = message.self()

  if (text === '你好小张') {
    startChat = true
    await room.say('来啦？老弟。')
    return false
  }

  if (text === '再见小张') {
    startChat = false
    await room.say('带上小张的祝福，滚的越远越好。')
    return false
  }

  if (!startChat || self || !room || type !== Message.Type.Text) {
    return false
  }

  const topic = await room.topic()

  if (topic !== '吃火锅学习交流群') {
    return false
  }

  try {
    const reply = await robot.ask(text, { userid: contact })
    await room.say(reply.text)
  } catch (e) {
    console.error(e)
  }
}

bot.on('scan', onScan)
bot.on('message', onMessage)
bot.start()
