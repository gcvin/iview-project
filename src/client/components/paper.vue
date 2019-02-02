<template lang="html">
    <div class="vpaper">
        <Input-number :max="20" :min="1" v-model="images" size="small" @on-change="getImages"></Input-number>
        <ul class="pages">
            <li class="paper" data-left :style="{animationDuration: `${duration / 1000}s`}">
                <div class="page page-1-back">
                    <img :src="urls[0]" height="100%" width="100%">
                </div>
                <div class="page page-1">
                    <img :src="urls[1]" height="100%" width="100%">
                </div>
            </li>
            <li class="paper" data-right :style="{animationDuration: `${duration / 1000}s`}">
                <div class="page page-2">
                    <img :src="urls[2]" height="100%" width="100%">
                </div>
                <div class="page page-2-back">
                    <img :src="urls[3]" height="100%" width="100%">
                </div>
            </li>
            <li v-for="n in pages" v-if="n > 2" :key="n" class="paper" :style="{animationDuration: `${duration / 1000}s`}">
                <div class="page">
                    <img :src="urls[2*n-2]" height="100%" width="100%">
                </div>
                <div class="page">
                    <img :src="urls[2*n-1]" height="100%" width="100%">
                </div>
            </li>
        </ul>
        <Button type="primary" @click="goToPrevPage" :disabled="isPreving">上一页</Button>
        <Button type="primary" @click="goToNextPage" :disabled="isNexting">下一页</Button>
    </div>
</template>

<script>
import { Message } from 'iview'
export default {
  name: 'paper',
  data () {
    return {
      page: 1,
      images: 1,
      urls: [],
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
    }
  },
  created () {
    this.images = this.pages
    this.getImages(this.images)
  },
  methods: {
    getImages (current) {
      let next = document.querySelector('.paper[data-right]')
      let prev = document.querySelector('.paper[data-left]')

      this.removePageState(prev, next)
      next = document.querySelector('.paper')
      this.addPageState(null, next)

      if (current * 2 > this.urls.length) {
        this.$http.get('/ajax/images?pages=' + this.images * 2).then(rs => {
          this.urls = rs.data.urls
        })
      }
    },
    goToPrevPage () {
      let next = document.querySelector('.paper[data-right]')
      let prev = document.querySelector('.paper[data-left]')

      this.checkPageState(prev, next)

      if (!prev) {
        return Message.warning('已经是第一页了')
      }

      this.isPreving = true
      prev.classList.add('current')
      prev.previousElementSibling && prev.previousElementSibling.classList.add('prev')
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

<style lang="less">
    .vpaper .pages {
        position: relative;
        height: 400px;
        margin-top: 10px;

        .paper {
            display: none;
            position: absolute;
            right: 0;
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
            width: 300px;
            height: 400px;
            border: 1px solid #eee;
            // line-height: 300px;
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

    .vpaper .ivu-btn {
        margin-top: 10px;
        margin-bottom: 10px;
    }
</style>
