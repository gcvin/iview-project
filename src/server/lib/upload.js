const bytes = require('bytes')
const multer = require('koa-multer')

const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: { fileSize: bytes('2MB') },
  fileFilter: (req, files, callback) => {
    const type = files.mimetype.slice(files.mimetype.lastIndexOf('/') + 1)
    const valid = '|jpg|png|jpeg|gif|'.includes('|' + type + '|')

    callback(null, valid)
  }
})

module.exports = upload
