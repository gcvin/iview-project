<template>
    <div class="index">
        <Row type="flex" justify="center" align="middle">
            <Col span="24">
                <h1>
                    <img src="@/images/logo.png">
                </h1>
                <h2>
                    <p>{{ slogan }}</p>
                    <Button type="primary" ghost @click="handleStart" class="tilt">Start iView</Button>
                    <br>
                    <br>
                    <icon-svg icon-class="youxiang" />
                    <Button type="primary" ghost @click="handleRecursion">递归</Button>
                    <Button type="primary" ghost @click="handlePromise">Promise</Button>
                    <Button type="primary" ghost @click="handleAwait">Async/Await</Button>
                    <icon-svg icon-class="anquan" />
                </h2>
                <ul class="icss">
                    <li><a href="/bus">Bus</a></li>
                    <li><a href="/github">Github</a></li>
                    <li><a href="/mongo">Mongo</a></li>
                    <li><a href="/upload">Upload</a></li>
                    <li><a href="/minivue">MiniVue</a></li>
                </ul>
            </Col>
        </Row>
        <a class="screen-shots" href="javascript:;" @click="handleShots"><Icon type="md-camera" /></a>
    </div>
</template>
<script>
import VanillaTilt from 'vanilla-tilt'
import html2canvas from 'html2canvas'
import iconSvg from '@/components/icon-svg'
export default {
    data: function () {
        return {
            arr: [1, 2, 3, 4], // 消息数组
            time: 1.5, // 每条消息显示多少秒
            slogan: '' // 欢迎语
        }
    },
    mounted () {
        // 3D翻转效果
        VanillaTilt.init(document.querySelector('.tilt'), {
            max: 50,
            speed: 400
        })
        // 触发自定义事件以便预渲染捕获
        document.dispatchEvent(new Event('render-event'))
        // 获取首页欢迎语
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
            let vm = this
                ;(function next (len, curr) {
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
            vm.promiseForEach(vm.arr, (curr) => {
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
                    return cb(item).then((res) => {
                        realResult.push(res)
                    })
                })
            })

            return result.then(() => {
                return realResult
            })
        },
        handleShots () {
            let vm = this
            html2canvas(document.body).then(canvas => {
                const height = canvas.height
                const width = canvas.width
                const style = {
                    position: 'absolute',
                    top: 0,
                    left: 0
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

                document.querySelector('.index').appendChild(shotsCanvas)

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
                    ctx.drawImage(canvas, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height)

                    vm.$Modal.info({
                        title: '截图',
                        width: area.width,
                        content: `<img src="${newCanvas.toDataURL()}" width="100%" height="100%"></img>`,
                        onOk () {
                            document.querySelector('.index').removeChild(shotsCanvas)
                        }
                    })
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
            })
        }
    }
}
</script>
<style scoped lang="less">
    .index{
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        text-align: center;
        h1{
            height: 150px;
            img{
                height: 100%;
            }
        }
        h2{
            color: #666;
            p{
                margin: 0 0 50px;
            }
        }
        .ivu-row-flex{
            height: 100%;
        }
        .icss{
            margin-top: 40px;
            li{
                display: inline-block;
                position: relative;
                padding: 10px;
                font-size: 14px;
                line-height: 1;
                transition: 0.2s all linear;
                cursor: pointer;
                &::before{
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 100%;
                    height: 1px;
                    width: 0;
                    border-bottom: 1px solid #2d8cf0;
                    transition: 0.2s all linear;
                }
                &:hover::before{
                    left: 0;
                    width: 100%;
                    transition-delay: 0.1s;
                }
                &:hover ~ li::before{
                    left: 0;
                }
            }
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
        }
    }
</style>
