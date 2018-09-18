<template lang="html">
    <div class="vpaper">
        <ul class="pages">
            <li class="paper" data-right :style="{animationDuration: duration}">
                <div class="page page-2">
                    page-1
                </div>
                <div class="page page-2-back">
                    page-1-back
                </div>
            </li>
            <li v-for="n in pages" v-if="n > 1" :key="n" class="paper" :style="{animationDuration: duration}">
                <div class="page">
                    page-{{n}}
                </div>
                <div class="page">
                    page-{{n}}-back
                </div>
            </li>
        </ul>
        <Button type="primary" @click="goToPrevPage">上一页</Button>
        <Button type="primary" @click="goToNextPage">下一页</Button>
    </div>
</template>

<script>
export default {
    name: 'paper',
    data () {
        return {
            page: 1
        }
    },
    props: {
        pages: {
            type: Number,
            required: true
        },
        delay: {
            type: Number,
            required: true
        }
    },
    computed: {
        duration () {
            return `${this.delay / 1000}s`
        }
    },
    methods: {
        goToPrevPage () {
            if (document.querySelector('[data-begin-animate]')) {
                return false
            }

            let next = document.querySelector('.paper[data-right]')
            let prev = document.querySelector('.paper[data-left]')

            if (!prev) {
                return alert('已经是第一页了')
            }

            prev.classList.add('current')
            prev.previousElementSibling && prev.previousElementSibling.classList.add('prev')
            prev.setAttribute('data-begin-animate', true)

            setTimeout(() => {
                prev.removeAttribute('data-begin-animate')
                prev.classList.remove('current')

                if (next) {
                    next.removeAttribute('data-right')
                    next.querySelector('.page-2').classList.remove('page-2')
                    next.querySelector('.page-2-back').classList.remove('page-2-back')
                }

                prev.removeAttribute('data-left')
                prev.querySelector('.page-1').classList.remove('page-1')
                prev.querySelector('.page-1-back').classList.remove('page-1-back')

                next = prev
                prev = next.previousElementSibling

                next.setAttribute('data-right', true)
                next.querySelector('.page').classList.add('page-2')
                next.querySelector('.page + .page').classList.add('page-2-back')

                if (prev) {
                    prev.classList.remove('prev')
                    prev.setAttribute('data-left', true)
                    prev.querySelector('.page').classList.add('page-1-back')
                    prev.querySelector('.page + .page').classList.add('page-1')
                }

                this.page--
            }, this.delay)
        },
        goToNextPage () {
            if (document.querySelector('[data-begin-animate]')) {
                return false
            }

            let next = document.querySelector('.paper[data-right]')
            let prev = document.querySelector('.paper[data-left]')

            if (!next) {
                return alert('已经是最后一页了')
            }

            next.classList.add('current')
            next.setAttribute('data-begin-animate', true)

            setTimeout(() => {
                next.removeAttribute('data-begin-animate')
                next.classList.remove('current')

                next.removeAttribute('data-right')
                next.querySelector('.page-2').classList.remove('page-2')
                next.querySelector('.page-2-back').classList.remove('page-2-back')

                if (prev) {
                    prev.removeAttribute('data-left')
                    prev.querySelector('.page-1').classList.remove('page-1')
                    prev.querySelector('.page-1-back').classList.remove('page-1-back')
                }

                prev = next
                next = prev.nextElementSibling

                prev.setAttribute('data-left', true)
                prev.querySelector('.page').classList.add('page-1-back')
                prev.querySelector('.page + .page').classList.add('page-1')

                if (next) {
                    next.setAttribute('data-right', true)
                    next.querySelector('.page').classList.add('page-2')
                    next.querySelector('.page + .page').classList.add('page-2-back')
                }

                this.page++
            }, this.delay)
        }
    }
}
</script>

<style lang="less">
    .vpaper .pages {
        position: relative;
        height: 300px;
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
            width: 200px;
            height: 300px;
            border: 1px solid #eee;
            line-height: 300px;
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
    }
</style>
