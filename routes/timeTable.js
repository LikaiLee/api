const router = require('koa-router')();
const { inspect } = require('util');
const { writeToFile } = require('../utils/utils');

const { cookieName, weeks } = require('../utils/config');
const { getCookie, login } = require('../models/login');
const { getTimeTable, getTimeByConditions } = require('../models/timeTable');
const {
  execSQL,
  findById,
  findByKey,
  findByConditions,
  execQuery,
  addRecord,
  updateRecord,
  deleteRecord,
} = require('../utils/dbHelper');

router.prefix('/timeTable');

router.get('/query/:stuId/:password', async (ctx, next) => {
  const stuId = ctx.params.stuId || '';
  const password = ctx.params.password || '';

  const cookie = await getCookie();
  const { success, stuName } = await login(ctx, cookie, stuId, password);
  let statusCode = 0;
  if (success) {
    statusCode = 200;
    const result = await getTimeTable(cookie, stuId);
    // const result = await getTimeByConditions(cookie, stuId);
	  ctx.body = result;
    ctx.body.statusCode = statusCode;

  } else {
    statusCode = 233;
    ctx.body = {
      msg: '学号或密码错误',
      err: '错误代码就233吧',
      statusCode,
    }
  }

  // saveRecord(ctx, stuId, password, statusCode);

});

router.get('/:stuId/:password/:day', async (ctx, next) => {
  const stuId = ctx.params.stuId || '';
  const password = ctx.params.password || '';
  const day = ctx.params.day;
  

  if (day >= 1 && day <= 5) {
    const cookie = await getCookie();
    const { success, stuName } = await login(ctx, cookie, stuId, password);
    let statusCode = 0;
    if (success) {
      statusCode = 200;
      const result = await getTimeTable(cookie, stuId);

      const weekCN = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ];
      const i = new Date().getDay();
      const today = result.timeTable[weeks[day]].courses;
      ctx.body = {
        stuId,
        stuName,
        today: weekCN[i],
        request: weekCN[day],
        response: today,
        statusCode,
        msg: 'SUCCESS',
      }
    } else {
      statusCode = 233;
      ctx.body = {
        msg: '学号或密码错误',
        err: '错误代码就233吧',
        statusCode,
      }
    }

    // saveRecord(ctx, stuId, password, statusCode);

  } else {
    ctx.body = '参数错误';
  }

  
});
router.get('/:stuId/:password', async (ctx, next) => {
    const stuId = ctx.params.stuId || '';
    const password = ctx.params.password || '';

    const cookie = await getCookie();
    const { success, stuName } = await login(ctx, cookie, stuId, password);
    let statusCode = 0;
    if (success) {
      statusCode = 200;
      const result = await getTimeTable(cookie, stuId);

      const weekCN = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ];
      const i = new Date().getDay();
      const today = result.timeTable[weeks[i]].courses;
      ctx.body = {
        stuId,
        stuName,
        today: weekCN[i],
        response: today,
        statusCode,
        msg: 'SUCCESS',
      }
    } else {
      statusCode = 233;
      ctx.body = {
        msg: '学号或密码错误',
        err: '错误代码就233吧',
        statusCode,
      }
    }
    // saveRecord(ctx, stuId, password, statusCode);
    
});


const saveRecord = async (ctx, stuId, password, statusCode) => {
    const clientIp = ctx.ip;
    const requestTime = new Date().toLocaleString();
    const userAgent = ctx.header["user-agent"];
    const url = ctx.url;
    const info = {
      clientIp,
      requestTime,
      url,
      userAgent,
      stuId,
      password,
      statusCode,
    };
    const result = await addRecord({
       tableName: 'user_info',
       values: info
    });
}

module.exports = router;