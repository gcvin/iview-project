import bytes from 'bytes'
import multer from 'koa-multer'

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

export default upload
