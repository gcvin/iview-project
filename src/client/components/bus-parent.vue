<template lang="html">
  <div>
    {{ value }}
    <Button @click="handleClick">验证</Button>
  </div>
</template>

<script>
import bus from '@/common/bus.js'

export default {
  data: function () {
    return {
      value: ''
    }
  },
  created () {
    bus.$on('change-value', value => {
      this.value = value
    })
  },
  methods: {
    handleClick () {
      this.$http
        .post('/ver-captcha', {
          data: {
            value: this.value
          }
        })
        .then(res => {
          this.$Message.info(res)
        })
    }
  }
}
</script>

<style lang="css" scoped>
</style>
