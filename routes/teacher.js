const router = require('koa-router')()
const {
  loginUrl,
  loginConfig,
  teacherLoginConfig,
  headerConfig
} = require('../utils/config')
const {
  getCookie,
  teacherLogin
} = require('../models/login')

const {
  getExamList
} = require('../models/teacher')
router.prefix('/teacher')

router.get('/', async(ctx, next) => {
  const teacherId = ctx.query.teacherId || ''
  const password = ctx.query.password || ''

  const cookie = await getCookie()
  const isLogin = await teacherLogin(cookie, teacherId, password)
  if (isLogin) {
    const data = await getExamList(cookie, teacherId)
    ctx.body = {
      data,
      statusCode: 200
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