<template>
  <div class="wechat">
    <template v-if="user">
      <Form label-position="right" :label-width="80">
        <FormItem label="用户昵称">
          <p>{{ user.payload.name }}</p>
        </FormItem>
        <FormItem label="群昵称">
          <Input placeholder="输入群昵称" :disabled="start" v-model="topic">
            <Icon type="md-contacts" slot="prefix" />
          </Input>
        </FormItem>
        <FormItem>
          <Button v-if="!start" type="success" @click="onStart" :disabled="!topic">开始使用</Button>
          <Button v-if="start && !stop" type="error" @click="onStop">停止使用</Button>
          <Button v-if="stop" type="warning">已停止</Button>
        </FormItem>
      </Form>
    </template>
    <template v-else>
      <img v-show="qrcode" :src="qrcode" alt="扫码登陆" height="185" width="185">
    </template>
  </div>
</template>

<script>
import io from 'socket.io-client'

const socket = io()
socket.emit('start')

export default {
  data () {
    return {
      code: 0,
      qrcode: '',
      topic: '',
      user: null,
      start: false,
      stop: false
    }
  },
  created () {
    socket.on('scan', (qrcode, code) => {
      this.qrcode = qrcode
      this.code = code
    })

    socket.on('login', user => {
      this.user = user
    })
  },
  methods: {
    onStart () {
      socket.emit('topic', this.topic)
      this.start = true
    },
    onStop () {
      socket.emit('stop')
      this.stop = true
    }
  }
}
</script>

<style lang="less" scoped>
.wechat {
  width: 300px;
  margin: 0 auto;
  text-align: center;
}
</style>
