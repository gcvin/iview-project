const routers = [
  {
    path: '/',
    meta: {
      title: 'home'
    },
    component: (resolve) => require(['@/views/index.vue'], resolve)
  },
  {
    path: '/bus',
    meta: {
      title: 'bus'
    },
    component: (resolve) => require(['@/views/bus.vue'], resolve)
  },
  {
    path: '/github',
    meta: {
      title: 'github'
    },
    component: (resolve) => require(['@/views/github.vue'], resolve)
  },
  {
    path: '/mongo',
    meta: {
      title: 'mongo'
    },
    component: (resolve) => require(['@/views/mongo.vue'], resolve)
  },
  {
    path: '/upload',
    meta: {
      title: 'upload'
    },
    component: (resolve) => require(['@/views/upload.vue'], resolve)
  },
  {
    path: '/cropper',
    meta: {
      title: 'cropper'
    },
    component: (resolve) => require(['@/views/cropper.vue'], resolve)
  },
  {
    path: '/wechat',
    meta: {
      title: 'wechat'
    },
    component: (resolve) => require(['@/views/wechat.vue'], resolve)
  }
]
export default routers
