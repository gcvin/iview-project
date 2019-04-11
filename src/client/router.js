const routers = [
  {
    path: '/',
    meta: {
      title: 'Home'
    },
    component: (resolve) => require(['@/views/index.vue'], resolve)
  },
  {
    path: '/bus',
    meta: {
      title: 'Bus'
    },
    component: (resolve) => require(['@/views/bus.vue'], resolve)
  },
  {
    path: '/github',
    meta: {
      title: 'Github'
    },
    component: (resolve) => require(['@/views/github.vue'], resolve)
  },
  {
    path: '/mongo',
    meta: {
      title: 'Mongo'
    },
    component: (resolve) => require(['@/views/mongo.vue'], resolve)
  },
  {
    path: '/upload',
    meta: {
      title: 'Upload'
    },
    component: (resolve) => require(['@/views/upload.vue'], resolve)
  },
  {
    path: '/wechat',
    meta: {
      title: 'Wechat'
    },
    component: (resolve) => require(['@/views/wechat.vue'], resolve)
  },
  {
    path: '/youpin',
    meta: {
      title: 'Youpin'
    },
    component: (resolve) => require(['@/views/youpin.vue'], resolve)
  },
  {
    path: '/video',
    meta: {
      title: 'Video'
    },
    component: (resolve) => require(['@/views/video.vue'], resolve)
  }
]
export default routers
