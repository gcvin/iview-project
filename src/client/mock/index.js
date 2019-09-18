import GLOBAL from '@/configs/global'

// 全局变量
if (GLOBAL.isMock) {
  let Mock = require('mockjs')

  // 用户信息接口
  Mock.mock('/get-slogan', () => ({
    slogan: 'Welcome to mock!'
  }))
}
