import Vue from 'vue'
import iView from 'iview'
import VueRouter from 'vue-router'
import axios from 'axios'
import Routers from '@/router'
import Util from '@/libs/util'
import App from '@/app.vue'
import '@/libs/register'

Vue.prototype.$http = axios
Vue.use(VueRouter)
Vue.use(iView)

const RouterConfig = {
  mode: 'history',
  routes: Routers
}
const router = new VueRouter(RouterConfig)

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  Util.title(to.meta.title)
  next()
})

router.afterEach((to, from, next) => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
})
