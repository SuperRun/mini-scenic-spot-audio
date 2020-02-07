// 写成这种形式便于后期拓展
module.exports = options => {
  return async (req, res, next) => {
    // 将首字母变大写 复数变单数
    const modelName = require('inflection').classify(req.params.resource)
    console.log(req.query)
    req.Model = require(`../models/${modelName}`)
    next()
  }
}