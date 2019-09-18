import Vue from 'vue'
import iView from 'iview'
import VueRouter from 'vue-router'
import Routers from '@/router'
import Util from '@/common/util'
import http from '@/common/http'
import App from '@/app.vue'
import animated from 'animate.css'
import '@/common/register'
import '@/mock'

Vue.config.devtools = true
Vue.prototype.$http = http
Vue.use(VueRouter)
Vue.use(iView)
Vue.use(animated)

const RouterConfig = {
  mode: 'history',
  routes: Routers
}
const router = new VueRouter(RouterConfig)

router.beforeEach((to, from, next) => {
  Util.title(to.meta.title)
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
})
