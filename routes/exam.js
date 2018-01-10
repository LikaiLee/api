const router = require('koa-router')()

const {
  getCookie,
  login
} = require('../models/login')
const {
  getExamList
} = require('../models/exam')

router.prefix('/exam')

router.get('/', async(ctx, next) => {
  const stuId = ctx.query.stuId || ''
  const password = ctx.query.password || ''

  const cookie = await getCookie()
  const {
    success,
    stuName
  } = await login(ctx, cookie, stuId, password)
  if (success) {

    const res = await getExamList(cookie, stuId)
    if (res) {
      ctx.body = {
        data: res,
        statusCode: 200,
      }
    } else {
      ctx.body = {
        msg: '无法获取课表',
        err: '错误代码就666吧',
        statusCode: 666,
      }
    }

  } else {
    ctx.body = {
      msg: '学号或密码错误',
      err: '错误代码就233吧',
      statusCode: 233,
    }
  }
})

module.exports = router