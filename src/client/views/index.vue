<template>
  <div class="index">
    <h1>
      <img src="@/images/logo.png" height="260">
    </h1>
    <h2>
      <p style="margin-bottom: 50px">{{ slogan }}</p>
      <Button type="primary" @click="handleStart" class="tilt">Start iView</Button>
      <br>
      <br>
      <icon-svg icon-class="anquan"/>
      <Button type="primary" @click="handleRecursion">递归</Button>
      <Button type="primary" @click="handlePromise">Promise</Button>
      <Button type="primary" @click="handleAwait">Async/Await</Button>
      <icon-svg icon-class="anquan"/>
    </h2>
  </div>
</template>
<script>
import VanillaTilt from 'vanilla-tilt'
import iconSvg from '@/components/icon-svg'
export default {
  data: function () {
    return {
      arr: [1, 2, 3, 4],
      time: 1.5,
      slogan: ''
    }
  },
  mounted () {
    VanillaTilt.init(document.querySelector('.tilt'), {
      max: 50,
      speed: 400
    })
    document.dispatchEvent(new Event('render-event'))
    this.$http.get('/ajax/get-slogan').then(res => {
      this.slogan = res.data.slogan
    })
  },
  components: {
    iconSvg
  },
  methods: {
    handleStart () {
      this.$Modal.info({
        title: 'Bravo',
        content: 'Now, enjoy the convenience of iView.'
      })
    },
    handleRecursion () {
      let vm = this;
      (function next (len, curr) {
        if (curr < len) {
          vm.$Message.info({
            content: `第${vm.arr[curr]}条消息`,
            duration: vm.time,
            onClose: _ => {
              next(len, curr + 1)
            }
          })
        }
      })(vm.arr.length, 0)
    },
    handlePromise () {
      let vm = this
      vm.promiseForEach(vm.arr, curr => {
        return new Promise((resolve, reject) => {
          vm.$Message.info({
            content: `第${curr}条消息`,
            duration: vm.time
          })
          setTimeout(() => {
            return resolve()
          }, vm.time * 1000)
        })
      })
    },
    async handleAwait () {
      let vm = this
      for (let i = 0; i < vm.arr.length; i++) {
        let number = vm.arr[i]
        await new Promise((resolve, reject) => {
          vm.$Message.info({
            content: `第${number}条消息`,
            duration: vm.time
          })
          setTimeout(() => {
            return resolve()
          }, vm.time * 1000)
        })
      }
    },
    promiseForEach (arr, cb) {
      let realResult = []
      let result = Promise.resolve()
      arr.forEach(item => {
        result = result.then(() => {
          return cb(item).then(res => {
            realResult.push(res)
          })
        })
      })

      return result.then(() => {
        return realResult
      })
    }
  }
}
</script>
<style scoped lang="less">
.ivu-btn {
  margin: 0 4px;
}
</style>
