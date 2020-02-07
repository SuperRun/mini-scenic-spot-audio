// 写成这种形式便于后期拓展
module.exports = options => {
  const AdminUser = require('../models/AdminUser')
  const jwt = require('jsonwebtoken')
  const assert = require('http-assert')

  return async (req, res, next) => {
    const token = req.headers.authorization
    assert(token, 401, 'token不存在')
    const { id } = jwt.verify(token, req.app.get('secret')) // 获取不到app
    assert(id, 401, 'token不正确')
    const user = await AdminUser.findById(id)
    assert(user, 401, '用户不存在')
    req.user = user
    await next()
  }
}