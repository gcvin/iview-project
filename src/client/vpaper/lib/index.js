/*
* @Author: gcvin
* @Date:   2018-09-18 16:35:00
* @Last Modified by:   gcvin
* @Last Modified time: 2018-09-18 16:38:48
*/
import vpaper from './paper.vue'

const myPlugin = {
  install (Vue, options) {
    Vue.component('vpaper', vpaper)
  }
}

export default myPlugin
