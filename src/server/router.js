import express from 'express'
import svgCaptcha from 'svg-captcha'
import qn from 'qn'
import User from './schema/user.js'
import upload from './upload'
import config from './config'

const router = express.Router()

let success = {
    success: true
}

// 七牛相关配置信息
let client = qn.create(config.QINIU)

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index')
})

router.get('/stats', function (req, res, next) {
    res.render('stats')
})

router.get('/ajax/get-slogan', function (req, res, next) {
    res.json({
        slogan: 'Welcome to your iView app!'
    })
})

router.get('/ajax/get-vercode', function (req, res, next) {
    res.json({
        vercode: Math.random().toString(36).slice(2, 8),
        times: 10
    })
})

router.get('/user/get-user', function (req, res, next) {
    const page = Number(req.query.page) || 1
    User.find({}).then(users => {
        return res.json({
            users: users.slice(page * 10 - 10, page * 10),
            total: users.length
        })
    }).catch(err => {
        console.log('Error:' + err)
    })
})

router.post('/user/remove-user', function (req, res, next) {
    User.remove({_id: req.body.id}).then(users => {
        return res.json(success)
    }).catch(err => {
        console.log('Error:' + err)
    })
})

router.post('/user/edit-user', function (req, res, next) {
    User.findByIdAndUpdate(req.body._id, req.body).then(users => {
        return res.json(success)
    }).catch(err => {
        console.log('Error:' + err)
    })
})

router.post('/user/add-user', function (req, res, next) {
    let user = new User(req.body)
    user.save().then(users => {
        return res.json(success)
    }).catch(err => {
        console.log('Error:' + err)
    })
})

router.get('/ajax/get-captcha', function (req, res, next) {
    let captcha = svgCaptcha.create({
        size: 4,
        width: 200,
        height: 40,
        ignoreChars: '0o1i',
        noise: 1,
        color: true,
        background: '#cc9966'
    })
    req.session.captcha = captcha.text
    console.info(captcha.text)
    res.send(captcha.data)
})

router.post('/ajax/ver-captcha', function (req, res, next) {
    let result = req.body.value.toLowerCase() === (req.session.captcha && req.session.captcha.toLowerCase())
    console.log(req.session.captcha)
    res.send(result ? '验证成功' : '验证失败')
})

router.post('/ajax/qnupload', function (req, res, next) {
    upload.single('image')(req, res, function (err) {
        if (err) {
            return console.error(err)
        }
        if (req.file && req.file.buffer) {
            client.upload(req.file.buffer, {
                key: '/upload/' + new Date().getTime()
            }, function (err, result) {
                if (err) {
                    return res.json({
                        success: false,
                        msg: err,
                        data: {
                            src: ''
                        }
                    })
                }
                res.json({
                    success: true,
                    msg: '上传成功！',
                    data: {
                        src: result.url
                    }
                })
            })
        }
    })
})

router.get('/ajax/qnlist', function (req, res, next) {
    client.list('/', function (err, result) {
        if (err) {
            return res.json({
                success: false,
                msg: err,
                data: []
            })
        }
        let files = result.items.map(item => ({
            url: client.resourceURL(item.key),
            key: item.key
        }))
        res.json({
            success: true,
            msg: '查询成功！',
            data: files
        })
    })
})

router.get('/ajax/qndelete', function (req, res, next) {
    client.delete(req.query.key, function (err) {
        if (err) {
            return res.json({
                success: false,
                msg: err
            })
        }
        res.json({
            success: true,
            msg: '删除成功！'
        })
    })
})

router.get('*', function (req, res, next) {
    res.render('index')
})

export default router
