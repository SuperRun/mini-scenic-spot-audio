module.exports = options => {
  return async (req, res, next) => {
    // 将首字母变大写 复数变单数
    const fileUrl = req.params.file
    req.fileUrl = require(`../models/${modelName}`)
    next()
  }
}