import path from 'path'
import svgCaptcha from 'svg-captcha'
import qn from 'qn'
import fs from 'fs'
import axios from 'axios'
import moment from 'moment'
import User from './schema/user.js'
import upload from './lib/upload'
import config from './config'

const router = require('koa-router')()

const success = {
  success: true
}

const renderHtml = (ctx, fname) => {
  const fpath = path.join(__dirname, './views/' + fname + '.html')
  ctx.set('Content-Type', 'text/html')
  ctx.body = fs.createReadStream(fpath)
}

// 七牛相关配置信息
const client = qn.create(config.QINIU)

router.get('/stats', async (ctx) => {
  renderHtml(ctx, 'stats')
})

router.get('/minivue', async (ctx) => {
  renderHtml(ctx, 'minivue')
})

router.get('/ajax/get-slogan', async (ctx) => {
  ctx.body = { slogan: 'Welcome to your iView app!' }
})

router.get('/ajax/get-vercode', async (ctx) => {
  ctx.body = {
    vercode: Math.random().toString(36).slice(2, 8),
    times: 10
  }
})

router.get('/user/get-user', async (ctx) => {
  const page = Number(ctx.query.page) || 1
  const users = await User.find(null, null, { skip: (page - 1) * 10, limit: 10 })
  const total = await User.countDocuments()

  ctx.body = {
    users,
    total
  }
})

router.post('/user/remove-user', async (ctx) => {
  await User.deleteOne({ _id: ctx.request.body.id })

  ctx.body = success
})

router.post('/user/edit-user', async (ctx) => {
  const body = ctx.request.body
  await User.findOneAndUpdate({ _id: body._id }, body)

  ctx.body = success
})

router.post('/user/add-user', async (ctx) => {
  const user = new User(ctx.request.body)
  await user.save()

  ctx.body = success
})

router.get('/ajax/get-captcha', async (ctx) => {
  const captcha = svgCaptcha.create({
    size: 4,
    width: 200,
    height: 40,
    ignoreChars: '0o1i',
    noise: 1,
    color: true,
    background: '#cc9966'
  })
  ctx.session.captcha = captcha.text
  ctx.set('Content-Type', 'image/svg+xml')
  ctx.body = captcha.data
})

router.post('/ajax/ver-captcha', async (ctx) => {
  const body = ctx.request.body
  const captcha = ctx.session.captcha
  const result = body.value.toLowerCase() === (captcha && captcha.toLowerCase())

  ctx.body = result ? '验证成功' : '验证失败'
})

router.post('/ajax/qnupload', upload.single('image'), async (ctx) => {
  const result = await new Promise(resolve => {
    client.upload(ctx.req.file.buffer, {
      key: '/upload/' + new Date().getTime()
    }, (err, result) => {
      if (err) {
        ctx.throw(500, err.message)
      } else {
        resolve(result)
      }
    })
  })

  ctx.body = {
    success: true,
    msg: '上传成功！',
    data: {
      key: result.key,
      src: result.url
    }
  }
})

router.get('/ajax/qnlist', async (ctx) => {
  const result = await new Promise(resolve => {
    client.list('/', (err, result) => {
      if (err) {
        ctx.throw(500, err.message)
      } else {
        resolve(result)
      }
    })
  })

  const files = result.items.map(item => ({
    url: client.resourceURL(item.key),
    key: item.key
  }))
  ctx.body = {
    success: true,
    msg: '查询成功！',
    data: files
  }
})

router.get('/ajax/qndelete', async (ctx) => {
  await new Promise(resolve => {
    client.delete(ctx.query.key, (err) => {
      if (err) {
        ctx.throw(500, err.message)
      } else {
        resolve()
      }
    })
  })

  ctx.body = {
    success: true,
    msg: '删除成功！'
  }
})

router.get('/ajax/images', async (ctx) => {
  const baseUrl = 'https://apod.nasa.gov/apod/'
  const urls = []

  let count = Number(ctx.query.pages)

  const getImage = async (num, offset) => {
    const pages = new Array(num).fill(undefined).map((item, index) => {
      const day = moment().subtract(index + offset, 'days').format('YYMMDD')
      return axios.get(`${baseUrl}ap${day}.html`)
    })

    const pageData = await Promise.all(pages)

    pageData.map(item => {
      const regex = item.data.match(/href="(image\/(\d+)\/([^.]+.jpg))"/)

      if (regex) {
        const url = regex[1]

        urls.push(`${baseUrl}${url}`)
        count--
      }
    })

    if (count) {
      await getImage(count, num + 1)
    }
  }

  await getImage(count, 1)

  ctx.body = { urls }
})

router.get('/proxy/image', async (ctx) => {
  const image = await axios({
    type: 'get',
    url: ctx.query.url,
    responseType: 'stream'
  })

  ctx.set('Cache-Control', 'max-age=31536000')
  ctx.type = 'image/png'
  ctx.status = 200
  ctx.body = image.data
})

router.get('*', async (ctx) => {
  renderHtml(ctx, 'index')
})

export default router
