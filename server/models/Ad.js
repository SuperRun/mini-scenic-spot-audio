/**
 * 【model】广告
 */
const mongoose = require('mongoose')

const schema = mongoose.Schema({
  name: { type: String }, // 广告标题
  items: [{
    image: { type: String }, // 广告图片url
    url: { type: String } // 广告链接
  }]
})

module.exports = mongoose.model('Ad', schema)