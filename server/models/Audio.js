/**
 * 【model】音频
 */
const mongoose = require('mongoose')

const schema = mongoose.Schema({
  name: { type: String }, // 音频标题
  url: { type: String }, // 音频存放路径
  filename: { type: String }, // 文件名
  type: { type: String }, // 1 => 简介解说  2 => 景区解说
  duration: { type: String }, // 音频时长
})

module.exports = mongoose.model('Audio', schema)