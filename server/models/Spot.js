/**
 * 【Model】景区
 */
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: { type: String }, // 景区名称
  type: { type: String }, // 景区类型：1 景区 2 博物馆
  price: { type: String }, // 价格
  image: { type: String }, // 封面图片
  rating: { type: Number }, // 推荐指数
  location: {
    lng: { type: String }, // 经度
    lat: { type: String }, // 纬度
  },
  address: { type: String }, //地址
  intorAudio: { type: mongoose.SchemaTypes.ObjectId, ref: 'Audio' }, // 景区简介音频
  introduction: { type: String }, // 景区介绍
  points: [{ // 讲解点
    name: { type: String }, // 讲解点名称
    location: { // 经纬度
      lng: { type: String }, // 经度
      lat: { type: String }, // 纬度
    },
    image: { type: String }, // 图片(展示音频列表需要)
    isFree: { type: Boolean }, // 是否作为试听音频
    audio: { type: mongoose.SchemaTypes.ObjectId, ref: 'Audio' } // 讲解点音频
  }],
  guidance: { // 参观指引
    openTime: { type: String }, // 营业时间
    ticket: { type: String }, // 门票
    betterVisitTime: { type: String }, // 建议游玩时间
    traffic: { type: String }, //交通
    tip: { type: String }, // 贴士
  }
})

module.exports = mongoose.model('Spot', schema)