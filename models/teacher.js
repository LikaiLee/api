const charset = require('superagent-charset')
const superagent = charset(require('superagent'))
const cheerio = require('cheerio')
const cheerioTableparser = require('cheerio-tableparser')
const {
  examUrl,
  headerConfig,
  teacherExamUrl
} = require('../utils/config')
const {
  parseToChinese
} = require('../utils/utils')


async function getExamList(cookie, teacherId) {
  const {
    status,
    text
  } = await superagent
    .get(`${teacherExamUrl}${teacherId}&gnmkdm=N122306`)
    .charset('gb2312')
    .set(headerConfig)
    .set({
      'Cookie': cookie,
      'Referer': `${teacherExamUrl}${teacherId}&gnmkdm=N122306`,
    })
  if (status !== 200) {
    return false
  }

  const $ = cheerio.load(text)
  cheerioTableparser($);
  const _table = $('#Datagrid1').parsetable()
  const tableData = parseToChinese(_table)
  let ret = []
  let itemLen = tableData[0].length
  const names = ['courseName', 'time', 'teacher', 'classroom', 'studentCount', 'monitor1', 'carLocation1', 'monitor2', 'carLocation2']
  for (let j = 1; j < itemLen; j++) {
    let obj = {}
    for (let i = 0; i < 8; i++) {
      if (i === 6) continue
      let item = tableData[i]
      obj[names[i]] = item[j]
    }
    ret.push(obj)
  }

  console.log(tableData)

  return ret

}

module.exports = {
  getExamList
}