<template lang="html">
  <div class="bus">
    <bus-parent :class="[{ active: isActive }, bold]"></bus-parent>
    <bus-child class="arrow"></bus-child>
    <div class="captcha" @click="getCaptcha" @mousemove="getPositon($event)"></div>
    <div class="double">
      十进制加法：
      <InputNumber v-model="addend" size="small" style="width: 180px" @on-change="getSumBinary"></InputNumber>
      <span class="plus">+</span>
      <InputNumber v-model="summand" size="small" style="width: 180px" @on-change="getSumBinary"></InputNumber><br>
      二进制求和：<Input v-model="binary" size="small" style="width: 400px"></Input><br>
      十进制结果：<span>{{ accurate }}</span>
    </div>
  </div>
</template>

<script>
/* eslint no-undef: "off" */
import busChild from '@/components/bus-child'
import busParent from '@/components/bus-parent'

export default {
  data () {
    return {
      isActive: true,
      bold: 'bold',
      addend: 0,
      summand: 0,
      binary: 0
    }
  },
  created () {
    this.getCaptcha()
  },
  components: {
    busChild,
    busParent
  },
  methods: {
    getCaptcha () {
      this.$http.get('/ajax/get-captcha').then(res => {
        document.querySelector('.captcha').innerHTML = res.data
      })
    },
    getPositon (e) {
      const target = document.querySelector('.captcha')

      target.style.setProperty('--x', `${e.offsetX}px`)
      target.style.setProperty('--y', `${e.offsetY}px`)
    },
    getBinary (decimal) {
      let result = ''
      let n = ~~decimal
      let m = decimal - n
      let count = 0
      let zero = 0

      if (!n) {
        result += '0'
      }

      while (n) {
        result = (n % 2) + result
        n = ~~(n / 2)
        count++
      }

      if (m) {
        result += '.'
      } else {
        result += '.0'
      }

      while (m) {
        result = result + ~~(m * 2)
        m = (m * 2) % 1
        count++
        if (!Number(result)) {
          zero++
        }
        if (count === 53 + zero) {
          break
        }
      }

      return result
    },
    getSumBinary () {
      let addend = this.getBinary(this.addend).split('.')
      let summand = this.getBinary(this.summand).split('.')

      const leftLen = Math.max(addend[0].length, summand[0].length)
      const rightLen = Math.max(addend[1].length, summand[1].length)

      addend =
        addend[0].padStart(leftLen, '0') +
        '.' +
        addend[1].padEnd(rightLen, '0')
      summand =
        summand[0].padStart(leftLen, '0') +
        '.' +
        summand[1].padEnd(rightLen, '0')

      let length = addend.length
      let result = ''
      let carry = 0

      while (length) {
        length--

        if (addend[length] !== '.') {
          result = (addend[length] ^ summand[length] ^ carry) + result
          carry = +(+addend[length] + +summand[length] + carry > 1)
        } else {
          result = '.' + result
        }
      }

      if (carry) {
        result = carry + result
      }

      this.binary = result
    }
  },
  computed: {
    accurate: function () {
      let result = 0
      let binary = this.binary + '.0'
      let n = binary
        .split('.')[0]
        .split('')
        .reverse()
      let m = binary.split('.')[1].split('')

      result += n.reduce((sum, curr, index) => {
        return sum + Number(curr) * Math.pow(2, index)
      }, 0)

      result += m.reduce((sum, curr, index) => {
        return sum + Number(curr) * Math.pow(2, index * -1 - 1)
      }, 0)

      return result
    }
  }
}
</script>

<style lang="less">
.bus {
  width: 500px;
  margin: 0 auto;
}
.active {
  color: #42b983;
}

.bold {
  font-weight: bold;
}

.arrow {
  margin-top: 20px;
}

.arrow:before {
  border: 10px solid transparent;
  border-bottom: 10px solid #dddee1;
  width: 0;
  height: 0;
  position: absolute;
  content: " ";
  top: -20px;
  left: 50%;
  margin-left: -10px;
  transition: border 0.2s ease-in-out;
}

.arrow:after {
  border: 10px solid transparent;
  border-bottom: 10px solid #fff;
  width: 0;
  height: 0;
  position: absolute;
  content: " ";
  top: -18px;
  left: 50%;
  margin-left: -10px;
}

.arrow:hover::before {
  border-bottom-color: #57a3f3;
}

.captcha {
  margin: 10px auto;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  height: 40px;
  width: 200px;

  &::before {
    --size: 0;

    content: "";
    position: absolute;
    left: var(--x);
    top: var(--y);
    width: var(--size);
    height: var(--size);
    background: radial-gradient(
      circle closest-side,
      #ff9900,
      #19be6b,
      #2d8cf0,
      transparent
    );
    transform: translate(-50%, -50%);
    transition: width 0.2s ease, height 0.2s ease;
  }

  &:hover::before {
    --size: 40px;
  }
}
.double {
  line-height: 50px;
  text-align: left;

  .plus {
    display: inline-block;
    text-align: center;
    width: 40px;
  }
}
</style>
