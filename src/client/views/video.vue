<template>
  <div class="video">
    <div class="player"></div>
  </div>
</template>

<script>
const Griffith = require('griffith')
export default {
  mounted () {
    const target = document.querySelector('.player')

    // 创建播放器
    const player = Griffith.createPlayer(target)

    const props = {
      locale: 'zh-Hans',
      sources: {
        hd: {
          play_url: 'https://zhstatic.zhihu.com/cfe/griffith/zhihu2018_hd.mp4'
        },
        sd: {
          play_url: 'https://zhstatic.zhihu.com/cfe/griffith/zhihu2018_sd.mp4'
        }
      }
    }

    // 载入视频
    player.render(props)

    // 销毁视频
    // player.dispose()
  }
}
</script>

<style lang="less" scoped>
.player {
  height: 500px;
  width: 800px;
}
</style>
