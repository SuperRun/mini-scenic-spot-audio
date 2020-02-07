/**
 * 通用CRUD
 * @param {*} app
 */
module.exports = app => {

  const express = require('express')
  const router = express.Router({
    mergeParams: true // 若不加无法在router中获取resource参数
  })

  const AdminUser = require('../../models/AdminUser')
  const jwt = require('jsonwebtoken')
  const assert = require('http-assert')

  // 中间件
  const authMiddleware = require('../../middleware/auth')
  const resMiddleware = require('../../middleware/resource')

  // 新增
  router.post('/', async (req, res) => {
    const model = await req.Model.create(req.body)
    res.send(model)
  })

  // 获取列表 
  router.get('/', async (req, res) => {
    console.log("获取列表")
    let queryOptions = {}
    if (req.Model.modelName === 'Category') {
      queryOptions.populate = 'parent'
    }
    const items = await req.Model.find(req.query).setOptions(queryOptions).limit(10)
    console.log(items)
    res.send(items)
  })

  // 获取详情 
  router.get('/:id', async (req, res) => {
    console.log(req.params)
    const model = await req.Model.findById(req.params.id)
    res.send(model)
  })

  // 编辑
  router.put('/:id', async (req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
    res.send(model)
  })

  // 删除
  router.delete('/:id', async (req, res) => {
    const model = await req.Model.findByIdAndDelete(req.params.id, req.body)
    res.send({
      success: true
    })
  })

  app.use('/admin/api/rest/:resource', authMiddleware(), resMiddleware(), router)

  // 上传图片 
  const multer = require('multer')
  const uploadImg = multer({ dest: __dirname + '/../../uploads/image' })
  app.post('/admin/api/upload/image', authMiddleware(), uploadImg.single('file'), async (req, res) => {
    const file = req.file
    file.url = `http://localhost:3000/uploads/image/${file.filename}`
    res.send(file)
  })

  // 上传音频
  const uploadAudio = multer({ dest: __dirname + '/../../uploads/audio' })
  app.post('/admin/api/upload/audio', authMiddleware(), uploadAudio.single('file'), async (req, res) => {
    const file = req.file
    file.url = `http://localhost:3000/uploads/audio/${file.filename}`
    res.send(file)
  })

  app.post('/admin/api/login', async (req, res) => {
    // 1. 根据用户名找到用户
    const { username, password } = req.body
    const user = await AdminUser.findOne({ username }).select('+password')
    assert(user, 422, '用户不存在')
    // 2. 核对密码
    const isValid = require('bcrypt').compareSync(password, user.password)
    assert(isValid, 422, '密码不正确')
    // 3. 返回token
    const token = jwt.sign({
      id: user._id
    }, app.get('secret')) // secret 全局定义的密钥
    res.send({ token })
  })

  // 异常处理
  app.use(async (err, req, res, next) => {
    res.status(err.status).send({
      message: err.message
    })
  })
}