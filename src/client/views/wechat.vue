<template>
  <div class="wechat">
    <template v-if="user">
      <Form ref="form" :rules="rule" label-position="right" :label-width="100" :model="form">
        <FormItem label="用户昵称">
          <p>{{ user.payload.name }}</p>
        </FormItem>
        <FormItem label="AI昵称" prop="name">
          <Input placeholder="输入AI昵称" :disabled="start" v-model="form.name">
            <Icon type="md-ionitron" slot="prefix" />
          </Input>
        </FormItem>
        <FormItem label="命令开启">
          <RadioGroup v-model="form.cmd" :disabled="start">
            <Radio :label="true">是</Radio>
            <Radio :label="false">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="开启命令" v-if="form.cmd">
          <Input :placeholder="defaultOpen" :disabled="start" v-model="form.open">
            <Icon type="md-heart" slot="prefix" />
          </Input>
        </FormItem>
        <FormItem label="关闭命令" v-if="form.cmd">
          <Input :placeholder="defaultClose" :disabled="start" v-model="form.close">
            <Icon type="md-heart-outline" slot="prefix" />
          </Input>
        </FormItem>
        <FormItem label="欢迎语句" v-if="form.cmd">
          <Input placeholder="hello" :disabled="start" v-model="form.hello">
            <Icon type="md-log-in" slot="prefix" />
          </Input>
        </FormItem>
        <FormItem label="结束语句" v-if="form.cmd">
          <Input placeholder="bye" :disabled="start" v-model="form.bye">
            <Icon type="md-log-out" slot="prefix" />
          </Input>
        </FormItem>
        <FormItem label="与自己聊天">
          <RadioGroup v-model="form.self" :disabled="start">
            <Radio :label="true">是</Radio>
            <Radio :label="false">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="聊天对象" prop="type">
          <RadioGroup v-model="form.type" :disabled="start">
            <Radio label="friend">微信好友</Radio>
            <Radio label="room">微信群聊</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="群聊名称" prop="topic" v-if="form.type==='room'">
          <Input placeholder="输入微信群聊名称" :disabled="start" v-model="form.topic">
            <Icon type="md-contacts" slot="prefix" />
          </Input>
        </FormItem>
        <FormItem label="好友昵称" prop="friend" v-if="form.type==='friend'">
          <Input placeholder="输入微信好友昵称" :disabled="start" v-model="form.friend">
            <Icon type="md-contact" slot="prefix" />
          </Input>
        </FormItem>
        <FormItem>
          <Button v-if="!start" type="success" @click="onStart">启动AI</Button>
          <Button v-else type="error" @click="onStop">停止AI</Button>
        </FormItem>
      </Form>
    </template>
    <template v-else>
      <img v-show="qrcode" :src="qrcode" alt="扫码登陆" height="185" width="185">
    </template>
  </div>
</template>

<script>
// import io from 'socket.io-client'

export default {
  data () {
    return {
      qrcode: '',
      form: {
        name: '',
        topic: '',
        open: '',
        close: '',
        type: '',
        hello: '',
        bye: '',
        self: false,
        cmd: true
      },
      rule: {
        name: [
          { required: true, message: 'AI昵称不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择聊天对象', trigger: 'change' }
        ],
        topic: [
          { required: true, message: '群聊名称不能为空', trigger: 'blur' }
        ],
        friend: [
          { required: true, message: '好友昵称不能为空', trigger: 'blur' }
        ]
      },
      user: null,
      start: false,
      socket: null
    }
  },
  computed: {
    defaultOpen () {
      return 'hello ' + this.form.name
    },
    defaultClose () {
      return 'bye ' + this.form.name
    }
  },
  created () {
    // this.socket = io()

    // this.socket.on('scan', qrcode => {
    //   this.qrcode = qrcode
    //   this.start = false
    //   this.user = null
    // })

    // this.socket.on('login', user => {
    //   this.user = user
    // })
  },
  methods: {
    onStart () {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }

        const defaultParams = {
          open: this.defaultOpen,
          close: this.defaultClose,
          hello: 'hello',
          bye: 'bye'
        }
        const params = this.assign({}, this.form, defaultParams)
        this.socket.emit('start', params)
        this.start = true
      })
    },
    onStop () {
      this.socket.emit('stop')
      this.start = false
      this.user = null
    },
    assign (obj, ...args) {
      args.forEach(arg => {
        for (let key in arg) {
          if (!obj[key]) {
            obj[key] = arg[key]
          }
        }
      })
      return obj
    }
  },
  beforeDestroy () {
    this.socket.emit('destroy')
    this.socket.close()
  },
  mounted () {
    window.onbeforeunload = () => {
      this.socket.emit('destroy')
      this.socket.close()
    }
  }
}
</script>

<style lang="less" scoped>
.wechat {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
