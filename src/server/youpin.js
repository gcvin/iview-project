const puppeteer = require('puppeteer')
const Progress = require('./lib/progress')
const BASE_URL = 'https://www.xiaomiyoupin.com'
const PAGE_NUM = 10

puppeteer.launch().then(async browser => {
  const category = []
  const products = []
  const goods = []
  const hash = {}
  const page = await browser.newPage()
  await page.goto(BASE_URL)
  await page.waitForSelector('.nav-item')
  await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.nav-item a')).map(item => item.dataset.src)
  }).then(rs => category.push(...new Set(rs)))

  let length = category.length
  let progress = new Progress('列表页读取进度', 50, length)

  const next = async (n, len) => {
    if (n >= len) {
      return
    }

    progress.update()
    await page.goto(BASE_URL + category[n])
    await page.waitForSelector('.pro-item')

    const innerH = await page.evaluate(() => window.innerHeight)
    const scroll = async (height = 0) => {
      await page.evaluate((height) => window.scrollTo(0, height), height + innerH)
      await page.evaluate(() => window.scrollY).then(async (h) => {
        if (h === height) {
          return
        }
        await page.waitFor(100)
        await scroll(h)
      })
    }
    await scroll()
    await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.pro-item')).map(item => {
        return {
          score: 0,
          count: 0,
          url: item.dataset.src,
          img: item.querySelector('img').dataset.src,
          id: Number(item.dataset.src.replace(/\D/g, '')),
          name: item.querySelector('.pro-info').textContent,
          price: Number(item.querySelector('.m-num').textContent),
          category: decodeURI(window.location.search.match(/title=([^&]+)/)[1])
        }
      })
    }).then(rs => products.push(...rs))
    await next(n + 1, len)
  }

  await next(0, length)
  await page.close()

  products.reduceRight((pre, cur) => {
    cur.url = BASE_URL + cur.url
    if (!hash[cur.id]) {
      hash[cur.id] = true && pre.push(cur)
    }
    return pre
  }, goods)

  length = goods.length
  progress = new Progress('详情页读取进度', 50, length)

  const filter = (n, page) => {
    if (n >= length) {
      return Promise.resolve()
    }

    return Promise.resolve().then(async () => {
      progress.update()
      await page.goto(goods[n].url)
      await page.waitForSelector('.info-nav-item')
      await page.$('.info-nav-item:nth-child(2)').then(el => el.click())
      await page.waitForSelector('.comment-top-container')
      await page.evaluate(() => {
        const rate = document.querySelector('.comment-top-positive-rate span')
        const tab = document.querySelector('.comment-top-tabs-item')

        if (rate && tab) {
          const score = Number(rate.textContent.replace(/\D/g, ''))
          const count = Number(tab.textContent.replace(/\D/g, ''))
          return [{ score, count }]
        }
      }).then(async rs => {
        if (!rs) {
          return
        }
        Object.assign(goods[n], rs[0])
      })
    }).then(() => {
      return filter(n + PAGE_NUM, page)
    }).catch(() => {
      return filter(n + PAGE_NUM, page)
    })
  }

  await Promise.all(new Array(PAGE_NUM).fill().map(async (_, index) => {
    const page = await browser.newPage()
    page.setDefaultTimeout(3000)
    return filter(index, page)
  }))

  await browser.close()

  console.log('\n写入数据库...')
  const Goods = require('./schema/goods')
  await Goods.bulkWrite(goods.map(item => {
    return {
      updateOne: {
        filter: { id: item.id },
        update: item,
        upsert: true
      }
    }
  }))

  await Goods.db.close()
  console.log('数据库写入成功!')
})
