<template>
  <div class="video">
    <video id="my-player" class="video-js vjs-big-play-centered">
      <!-- <track kind="captions" src="//d2zihajmogu5jn.cloudfront.net/elephantsdream/captions.en.vtt" srclang="en" label="English"> -->
      <p class="vjs-no-js">
        To view this video please enable JavaScript, and consider upgrading to a
        web browser that
        <a href="https://videojs.com/html5-video-support/" target="_blank">
          supports HTML5 video
        </a>
      </p>
    </video>
    <Input v-model="danmu" @on-enter="onShoot" style="width: 200px; margin-top: 10px" placeholder="回车一时爽，一直回车一直爽" size="small"/>
  </div>
</template>

<script>
import videojs from 'videojs'

const MAX_DM_COUNT = 6
const CHANNEL_COUNT = 10

export default {
  data () {
    return {
      hasPosition: [],
      domPool: [],
      domAll: [],
      danmu: '',
      player: null,
      options: {
        autoplay: true,
        controls: true,
        liveui: true,
        preload: 'auto',
        height: 500,
        width: 800,
        language: 'zh-CN',
        controlBar: {
          volumePanel: {
            inline: false
          }
        },
        sources: [{
          label: '高清',
          src: 'https://zhstatic.zhihu.com/cfe/griffith/zhihu2018_hd.mp4',
          type: 'video/mp4'
        }, {
          label: '标清',
          src: 'https://zhstatic.zhihu.com/cfe/griffith/zhihu2018_sd.mp4',
          type: 'video/mp4'
        }]
        // sources: [{
        //   src: 'https://akamai-axtest.akamaized.net/routes/lapd-v1-acceptance/www_c4/Manifest.m3u8',
        //   type: 'application/x-mpegURL'
        // }]
      }
    }
  },
  mounted () {
    this.player = videojs('my-player', this.options)

    const self = this
    const Button = videojs.getComponent('Button')
    const MenuItem = videojs.getComponent('MenuItem')
    const MenuButton = videojs.getComponent('MenuButton')
    const controlBar = this.player.getChild('controlBar')

    class MyMenuButton extends MenuButton {
      constructor (player, options) {
        super(player, options)
        this.controlText('画质')
        this.on(player, 'loadstart', this.updateLabel)
      }

      createItems () {
        const items = []
        const sources = this.player().options_.sources

        sources.forEach((source, index) => {
          if (!source.label) {
            return false
          }
          const menuItem = new MyMenuItem(this.player(), { index })
          items.push(menuItem)
        })

        return items
      }

      createEl () {
        const el = super.createEl()
        this.label = videojs.dom.createEl('div', {
          className: 'vjs-playback-hd-value'
        })
        el.appendChild(this.label)
        return el
      }

      buildCSSClass () {
        return `vjs-playback-hd ${super.buildCSSClass()}`
      }

      buildWrapperCSSClass () {
        return `vjs-playback-hd ${super.buildWrapperCSSClass()}`
      }

      updateLabel () {
        const selectLable = this.$('.vjs-selected span')
        if (!selectLable) {
          return false
        }
        this.label.innerHTML = selectLable.innerHTML
      }
    }

    class MyMenuItem extends MenuItem {
      constructor (player, options) {
        const source = player.options_.sources[options.index]

        options.label = source.label
        options.selectable = true
        options.multiSelectable = false

        super(player, options)
        this.source = source
        this.on(player, 'loadstart', this.update)
      }

      handleClick (event) {
        const player = this.player()
        super.handleClick()
        player.src(player.options_.sources[+event.currentTarget.dataset.index])
      }

      createEl () {
        return super.createEl('li', {}, { 'data-index': this.options_.index })
      }

      update (event) {
        this.selected(this.player().src() === this.source.src)
      }
    }

    class MyButton extends Button {
      constructor (player, options) {
        super(player, options)
        this.controlText('弹幕')
      }

      buildCSSClass () {
        return `vjs-danmu-control ${super.buildCSSClass()}`
      }

      createEl () {
        const el = super.createEl()
        this.text = videojs.dom.createEl('span', {
          className: 'vjs-danmu-open',
          innerHTML: this.localize('弹')
        })
        el.appendChild(this.text)
        return el
      }

      handleClick () {
        const isOpen = this.text.classList.contains('vjs-danmu-open')
        isOpen ? self.destroyDanmu() : self.createDammu()
        this.text.classList.toggle('vjs-danmu-open')
      }
    }

    videojs.registerComponent('MyButton', MyButton)
    videojs.registerComponent('MyMenuButton', MyMenuButton)

    controlBar.addChild('MyButton')
    controlBar.addChild('MyMenuButton')

    this.initDanmu(this.player.el())
  },
  beforeDestroy () {
    this.player.dispose()
  },
  methods: {
    initDanmu (ele) {
      for (let m = 0; m < CHANNEL_COUNT; m++) {
        const doms = []
        for (let n = 0; n < MAX_DM_COUNT; n++) {
          const dom = document.createElement('span')
          ele.appendChild(dom)
          dom.className = 'right'
          dom.style.top = m * 20 + 'px'
          doms.push(dom)
          this.domAll.push(dom)
          dom.addEventListener('transitionend', () => {
            dom.className = 'right'
            dom.style.transform = null
            this.domPool[m].push(dom)
          })
        }
        this.domPool.push(doms)
      }

      this.hasPosition.push(...new Array(CHANNEL_COUNT).fill(true))
    },
    getChannel () {
      for (let m = 0; m < CHANNEL_COUNT; m++) {
        if (this.hasPosition[m] && this.domPool[m].length) return m
      }
      return -1
    },
    shootDanmu (dom, text, channel) {
      dom.innerText = text
      dom.style.transform = `translateX(${-dom.clientWidth}px)`
      dom.className = 'left'

      this.hasPosition[channel] = false
      setTimeout(() => {
        this.hasPosition[channel] = true
      }, dom.clientWidth * 10 + 1000)
    },
    createDammu () {
      this.domAll.forEach(dom => {
        const className = dom.className
        if (className === 'right') {
          dom.style.visibility = 'visible'
        }
        if (className === 'left') {
          const onTransitionend = () => {
            dom.style.visibility = 'visible'
            dom.removeEventListener('transitionend', onTransitionend)
          }
          dom.addEventListener('transitionend', onTransitionend)
        }
      })
    },
    destroyDanmu () {
      this.domAll.forEach(dom => {
        const className = dom.className
        if (className === 'right') {
          dom.style.visibility = 'hidden'
        }
        if (className === 'left') {
          const onTransitionend = () => {
            dom.style.visibility = 'hidden'
            dom.removeEventListener('transitionend', onTransitionend)
          }
          dom.addEventListener('transitionend', onTransitionend)
        }
      })
    },
    onShoot () {
      const channel = this.getChannel()
      if (channel === -1) {
        return this.$Message.warning('目前没有可用通道，请稍后再试')
      }
      const dom = this.domPool[channel].shift()
      this.shootDanmu(dom, this.danmu, channel)
    }
  }
}
</script>

<style lang="less">
.video-js {
  position: relative;
  height: 500px;
  width: 800px;

  .right {
    left: 0;
    position: absolute;
    visibility: hidden;
    white-space: nowrap;
    transform: translateX(800px);
  }

  .left {
    left: 0;
    position: absolute;
    white-space: nowrap;
    user-select: none;
    transition: transform 7s linear;
    font-size: 14px;
  }

  .vjs-play-progress {
    background: linear-gradient(to right, #FFD700, #9AE6C8);
  }

  .vjs-volume-level {
    background: linear-gradient(to top, #FFD700, #9AE6C8);
  }

  .vjs-time-control {
    display: block;
  }

  .vjs-playback-hd .vjs-menu {
    width: 4em;
    left: 0;
  }

  .vjs-danmu-control {
    cursor: pointer;
    flex: none;
  }

  .vjs-danmu-open {
    color: #FFD700;
  }

  .vjs-playback-hd .vjs-playback-hd-value {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    line-height: 3em;
    font-size: 1em;
    text-align: center;
  }

  .vjs-menu li {
    text-transform: none;
  }
}
</style>
