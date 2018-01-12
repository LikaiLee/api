const router = require('koa-router')()
const superagent = require('superagent')

router.prefix('/hdu')

router.get('/', async(ctx, next) => {
  const res = await superagent
    .post('https://inquire.hduhelp.com/mobile/search')
    .send({
      "cabinet_id": "J9zD",
      "cabinet_index": [{
        "id": "JYx3y",
        "type": 1,
        "field": "1",
        "name": "楼号 ",
        "value": "6"
      }, {
        "id": "bl2ee",
        "type": 1,
        "field": "2",
        "name": "房间",
        "value": "1110"
      }]
    })

  ctx.body = res.body
})

module.exports = router