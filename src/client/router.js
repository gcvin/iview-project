const routers = [
  {
    path: '/',
    meta: {
      title: 'Home'
    },
    component: () => import(/* webpackChunkName: "index" */ '@/views/index.vue')
  },
  {
    path: '/bus',
    meta: {
      title: 'Bus'
    },
    component: () => import(/* webpackChunkName: "bus" */ '@/views/bus.vue')
  },
  {
    path: '/github',
    meta: {
      title: 'Github'
    },
    component: () => import(/* webpackChunkName: "github" */ '@/views/github.vue')
  },
  {
    path: '/mongo',
    meta: {
      title: 'Mongo'
    },
    component: () => import(/* webpackChunkName: "mongo" */ '@/views/mongo.vue')
  },
  {
    path: '/upload',
    meta: {
      title: 'Upload'
    },
    component: () => import(/* webpackChunkName: "upload" */ '@/views/upload.vue')
  },
  {
    path: '/wechat',
    meta: {
      title: 'Wechat'
    },
    component: () => import(/* webpackChunkName: "wechat" */ '@/views/wechat.vue')
  },
  {
    path: '/youpin',
    meta: {
      title: 'Youpin'
    },
    component: () => import(/* webpackChunkName: "youpin" */ '@/views/youpin.vue')
  },
  {
    path: '/video',
    meta: {
      title: 'Video'
    },
    component: () => import(/* webpackChunkName: "video" */ '@/views/video.vue')
  }
]
export default routers
