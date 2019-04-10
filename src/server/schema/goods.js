const mongoose = require('../lib/db.js')

const GoodsSchema = new mongoose.Schema({
  id: { type: Number },
  name: { type: String },
  url: { type: String },
  img: { type: String },
  price: { type: Number },
  score: { type: Number, default: 0 },
  count: { type: Number, default: 0 },
  category: { type: String }
})

module.exports = mongoose.model('Goods', GoodsSchema)
