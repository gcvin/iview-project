<template lang="html">
  <div class="vpaper">
    <ul class="pages">
      <li class="paper" data-left :style="{animationDuration: `${duration / 1000}s`}">
        <div class="page page-1-back">
          <img :src="urls[0]" height="100%" width="100%" alt="1">
        </div>
        <div class="page page-1">
          <img :src="urls[1]" height="100%" width="100%" alt="2">
        </div>
      </li>
      <li class="paper" data-right :style="{animationDuration: `${duration / 1000}s`}">
        <div class="page page-2">
          <img :src="urls[2]" height="100%" width="100%" alt="3">
        </div>
        <div class="page page-2-back">
          <img :src="urls[3]" height="100%" width="100%" alt="4">
        </div>
      </li>
      <template v-for="n in pages">
        <li v-if="n > 2" :key="n" class="paper" :style="{animationDuration: `${duration / 1000}s`}">
          <div class="page">
            <img :src="urls[2*n-2]" height="100%" width="100%" :alt="2*n-1">
          </div>
          <div class="page">
            <img :src="urls[2*n-1]" height="100%" width="100%" :alt="2*n">
          </div>
        </li>
      </template>
    </ul>
    <ButtonGroup>
        <Button type="primary" @click="goToPrevPage" :disabled="isPreving">
            <Icon type="ios-arrow-back" />
            Backward
        </Button>
        <Button type="primary" @click="goToNextPage" :disabled="isNexting">
            Forward
            <Icon type="ios-arrow-forward" />
        </Button>
    </ButtonGroup>
  </div>
</template>

<script>
import { Message, ButtonGroup, Button, Icon } from 'iview'
export default {
  name: 'paper',
  components: { ButtonGroup, Button, Icon },
  data () {
    return {
      page: 1,
      isPreving: false,
      isNexting: false
    }
  },
  props: {
    pages: {
      type: Number,
      default: 6
    },
    duration: {
      type: Number,
      default: 500
    },
    urls: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    goToPrevPage () {
      let next = document.querySelector('.paper[data-right]')
      let prev = document.querySelector('.paper[data-left]')

      this.checkPageState(prev, next)

      if (!prev) {
        return Message.warning('已经是第一页了')
      }

      this.isPreving = true
      prev.classList.add('current')
      prev.previousElementSibling?.classList.add('prev') /* eslint no-unused-expressions: "off" */
      prev.setAttribute('data-begin-animate', true)

      setTimeout(() => {
        this.removePageState(prev, next)
        next = prev
        prev = next.previousElementSibling
        this.addPageState(prev, next)
        this.isPreving = false
        this.page--
      }, this.duration)
    },
    goToNextPage () {
      let next = document.querySelector('.paper[data-right]')
      let prev = document.querySelector('.paper[data-left]')

      this.checkPageState(prev, next)

      if (!next) {
        return Message.warning('已经是最后一页了')
      }

      this.isNexting = true
      next.classList.add('current')
      next.setAttribute('data-begin-animate', true)

      setTimeout(() => {
        this.removePageState(prev, next)
        prev = next
        next = prev.nextElementSibling
        this.addPageState(prev, next)
        this.isNexting = false
        this.page++
      }, this.duration)
    },
    removePageState (prev, next) {
      if (next) {
        next.removeAttribute('data-begin-animate')
        next.classList.remove('current')

        next.removeAttribute('data-right')
        next.querySelector('.page-2').classList.remove('page-2')
        next.querySelector('.page-2-back').classList.remove('page-2-back')
      }

      if (prev) {
        prev.removeAttribute('data-begin-animate')
        prev.classList.remove('current')

        prev.removeAttribute('data-left')
        prev.querySelector('.page-1').classList.remove('page-1')
        prev.querySelector('.page-1-back').classList.remove('page-1-back')
      }
    },
    addPageState (prev, next) {
      if (prev) {
        prev.classList.remove('prev')
        prev.setAttribute('data-left', true)
        prev.querySelector('.page').classList.add('page-1-back')
        prev.querySelector('.page + .page').classList.add('page-1')
      }

      if (next) {
        next.setAttribute('data-right', true)
        next.querySelector('.page').classList.add('page-2')
        next.querySelector('.page + .page').classList.add('page-2-back')
      }
    },
    checkPageState (prev, next) {
      if (document.querySelector('[data-begin-animate]')) {
        return false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.vpaper .pages {
  position: relative;
  width: 100vw;
  height: calc(100vw * 2 / 3);
  max-width: 600px;
  max-height: 400px;
  margin: 20px 0;
  overflow: visible;

  .paper {
    display: none;
    position: absolute;
    right: 0;
    width: 50%;
    height: 100%;
    transform-style: preserve-3d;
  }

  .paper[data-left],
  .paper[data-right] {
    display: block;
    z-index: 1;
  }

  .paper[data-left] {
    left: 0;
    right: auto;
  }

  .paper[data-right] + .paper {
    display: block;
  }

  .paper[data-right][data-begin-animate] {
    transform-origin: left center;
    animation-name: flip-to-left;
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
  }

  .paper[data-left][data-begin-animate] {
    transform-origin: right center;
    animation-name: flip-to-right;
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
  }

  .current[data-left],
  .current[data-right] {
    z-index: 2;
  }

  .prev {
    display: block;
    left: 0;
    right: auto;
  }

  .page {
    width: 100%;
    height: 100%;
    border: 1px solid #eee;
    text-align: center;
    background-color: #fff;
  }

  .page-1-back,
  .page-2-back {
    position: absolute;
    transform: scale(-1, 1);
    top: 0;
    left: 0;
  }

  .page-1,
  .page-2 {
    z-index: 1;
    transform: translateZ(1px);
  }

  .prev .page + .page,
  .paper[data-right] + .paper .page {
    transform: translateZ(1px);
  }

  .prev .page,
  .paper[data-right] + .paper .page + .page {
    transform: translateZ(0px);
  }

  .prev .page + .page,
  .paper[data-right] + .paper .page + .page {
    position: absolute;
    top: 0;
    left: 0;
  }

  @keyframes flip-to-left {
    from {
      transform: perspective(1000px) rotateY(0);
    }
    to {
      transform: perspective(1000px) rotateY(-180deg);
    }
  }

  @keyframes flip-to-right {
    from {
      transform: perspective(1000px) rotateY(0);
    }
    to {
      transform: perspective(1000px) rotateY(180deg);
    }
  }
}
</style>
