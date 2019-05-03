<template>
  <div id="app">
    <nav-bar></nav-bar>
    <router-view class="page"></router-view>
    <a class="screen-shots" href="javascript:;" @click="handleShots">
      <Icon type="md-camera"/>
    </a>
  </div>
</template>
<script>
import html2canvas from 'html2canvas'
import navBar from '@/components/nav-bar'

export default {
  data () {
    return {
      isbusy: false
    }
  },
  components: { navBar },
  methods: {
    handleShots () {
      const vm = this
      const root = document.querySelector('#app')

      if (vm.isbusy) {
        return false
      }

      html2canvas(root, {
        scale: 1,
        windowWidth: root.scrollWidth,
        logging: false,
        proxy: '/proxy/image'
      }).then(canvas => {
        vm.isbusy = true
        const height = canvas.height
        const width = canvas.width
        const style = {
          position: 'absolute',
          top: root.offsetTop + 'px',
          left: root.offsetLeft + 'px',
          zIndex: 999
        }

        const shotsCanvas = createCanvas(height, width, style)

        const ctx = shotsCanvas.getContext('2d')
        ctx.fillStyle = '#00000033'
        ctx.fillRect(0, 0, width, height)

        let area = {}
        let startX
        let startY
        let endX
        let endY
        let isStart

        shotsCanvas.addEventListener('mousedown', handleMousedown)

        shotsCanvas.addEventListener('mousemove', handleMousemove)

        shotsCanvas.addEventListener('mouseup', handleMouseup)

        root.appendChild(shotsCanvas)

        function handleMousedown (e) {
          if (isStart) {
            return false
          }

          startX = e.offsetX
          startY = e.offsetY
          isStart = true
        }

        function handleMousemove (e) {
          if (!isStart) {
            return false
          }

          endX = e.offsetX
          endY = e.offsetY

          ctx.clearRect(0, 0, width, height)
          ctx.fillRect(0, 0, width, height)

          area.x = Math.min(startX, endX)
          area.y = Math.min(startY, endY)
          area.width = Math.abs(startX - endX)
          area.height = Math.abs(startY - endY)

          ctx.clearRect(area.x, area.y, area.width, area.height)
        }

        function handleMouseup () {
          isStart = false

          if (Math.abs(startX - endX) < 8 && Math.abs(startY - endY) < 8) {
            return false
          }

          shotsCanvas.removeEventListener('mousedown', handleMousedown)
          shotsCanvas.removeEventListener('mousemove', handleMousemove)
          shotsCanvas.removeEventListener('mouseup', handleMouseup)

          const newCanvas = createCanvas(area.height, area.width)
          const ctx = newCanvas.getContext('2d')
          ctx.drawImage(
            canvas,
            area.x,
            area.y,
            area.width,
            area.height,
            0,
            0,
            area.width,
            area.height
          )

          shotsFinish(newCanvas)
        }

        function createCanvas (height, width, style = {}) {
          const canvas = document.createElement('canvas')

          canvas.height = height
          canvas.width = width

          for (let key in style) {
            canvas.style[key] = style[key]
          }

          return canvas
        }

        function shotsFinish (canvas) {
          vm.$Modal.info({
            title: '截图',
            width: area.width + 82,
            content: `<img src="${canvas.toDataURL()}" width="100%" height="100%"></img>`,
            onOk () {
              vm.isbusy = false
              root.removeChild(shotsCanvas)
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "styles/normalize.css";
@import "styles/common.css";

#app {
  height: 100%;
  text-align: center;
}

.screen-shots {
  position: fixed;
  bottom: 20px;
  right: 20px;
  font-size: 30px;
  height: 50px;
  width: 50px;
  line-height: 46px;
  text-align: center;
  background-color: #3899ff80;
  border-radius: 50%;
  color: #3899ff;
  z-index: 999;
}

.page {
  min-height: calc(100% - 48px);
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
