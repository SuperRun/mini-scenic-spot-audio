const express = require('express')
const app = express()

app.set('secret', 'miniaudio')
app.use(express.json())
app.use(require('cors')())
app.use('/uploads', express.static(__dirname + '/uploads')) // 路由访问/uploads 托管静态文件

require('./plugins/db')(app)
require('./routes/admin')(app)

app.listen(3000, () => {
  // 启动之后的回调函数
  console.log('app port is 3000')
})