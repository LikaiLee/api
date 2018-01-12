const charset = require('superagent-charset')
const superagent = charset(require('superagent'))
const cheerio = require('cheerio')
const cheerioTableparser = require('cheerio-tableparser')
const {
  examUrl,
  headerConfig
} = require('../utils/config')
const {
  parseToChinese
} = require('../utils/utils')

async function getExamList(cookie, stuId) {
  try {
    const {
      status,
      text
    } = await superagent
      .get(`${examUrl}${stuId}&gnmkdm=N121604`)
      .charset('gb2312')
      .set(headerConfig)
      .set({
        'Cookie': cookie,
        'Referer': `${examUrl}${stuId}&gnmkdm=N121604`,
      })
      .query({
        __EVENTTARGET: 'xqd',
        __EVENTARGUMENT: '',
        __LASTFOCUS: '',
        __VIEWSTATE: '/wEPDwUJNjg3MDc5MzMzD2QWAgIBD2QWBAIBDxAPFgYeDURhdGFUZXh0RmllbGQFAnhuHg5EYXRhVmFsdWVGaWVsZAUCeG4eC18hRGF0YUJvdW5kZ2QQFQMJMjAxNy0yMDE4CTIwMTYtMjAxNwkyMDE1LTIwMTYVAwkyMDE3LTIwMTgJMjAxNi0yMDE3CTIwMTUtMjAxNhQrAwNnZ2cWAWZkAgUPEGRkFgECAWRkxQt/qN03HdJOoJvSj4vOA4mWRE8=',
        __EVENTVALIDATION: '/wEWCQKJ1JyjAQLOmbWVDAKZ8trqAwKe8p7VAgKf8qKVAwLOmemVDALB9sN7AsD2w3sCw/bDe2PErH+rLlSMeS3lnpwBWi1l1oBq',
        xnd: '2017-2018',
        xqd: 1
      })
    if (status !== 200) {
      return false
    }
    const $ = cheerio.load(text)
    cheerioTableparser($);
    const _table = $('#DataGrid1').parsetable()
    const tableData = parseToChinese(_table)
    let ret = []
    let itemLen = tableData[0].length
    const names = ['courseNo', 'courseName', 'stuName', 'time', 'location', 'type', 'seatNo']
    for (let j = 1; j < itemLen; j++) {
      let obj = {}
      for (let i = 0; i < tableData.length; i++) {
        let item = tableData[i]
        obj[names[i]] = item[j]
      }
      ret.push(obj)
    }
    return ret

  } catch (e) {
    console.log(e)
    return false
  }
}

module.exports = {
  getExamList
}