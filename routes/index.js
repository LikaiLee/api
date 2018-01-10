const router = require('koa-router')();
const { cookieName } = require('../utils/config');
const { getCookie, login } = require('../models/login');
const { getTimeTable } = require('../models/timeTable');
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

/*router.get('/mysql', async (ctx, next) => {
  const obj1 = await findByConditions({
    tableName: 'user_info',
    fields: 'id, stu_id, stu_name, myName',
    where: [ "id > 1", "stu_id > 1", "password = 'pwd123456' order by id desc"],
    // order: 'id desc',
    // group: 'stuId',
  });*/
  // const obj2 = await findById('user_info', 4);
  // const obj3 = await findByKey('user_info', { password: 'fa' });
  // const obj4 = await execSQL('delete from user_info ')
  /*const obj5 = await addRecord({
    tableName: 'user_info',
    values: {
      id: 6,
      stuId: 110,
      password: 'pwd123456',
      stu_name: 'name',
      lastIp: '123.120.110',
      lastTime: new Date().toLocaleString(),
    }
  });*/
  /*const obj6 = await updateRecord({
    tableName: 'user_info',
    values: {
      stuId: 23333,
      password: 23333,
      lastIp: '233.233.233',
      lastTime: new Date().toLocaleString(),
    },
    where: ["stu_name = 'name11'", 'id > 1']
  });
  const obj7 = await deleteRecord({
    tableName: 'user_info',
    where: ["stu_id = '23333'", 'id >= 1']
  });
  ctx.body = 'mysql';
});

router.get('/cookie', async (ctx, next) => {
  
  //const cookie = ctx.cookies.get(cookieName);
  //ctx.body = cookie;
  
  ctx.body = ctx;

});*/

router.get('/', async (ctx, next) => {
  ctx.body = {
    status: 233,
    msg: 'GET is not allowed here!',
    date: new Date(Date.now()).toLocaleString(),
    emmmm: 'LikaiLee',
  }
});


module.exports = router;
