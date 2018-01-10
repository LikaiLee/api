const charset = require('superagent-charset');
const superagent = charset(require('superagent'));
const cheerio = require('cheerio');
const cheerioTableparser = require('cheerio-tableparser');
const he = require('he');
const util = require('util');

const { headerConfig, timeTableUrl, mainUrl, startTimes, endTimes } = require('../utils/config');
const { writeToFile } = require('../utils/utils');

async function getTimeTable(cookie, stuId) {
	try {
		const { status, text } = await superagent
			.get(`${timeTableUrl}${stuId}`)
			.charset('gb2312')
			.set(headerConfig)
			.set({
				'Cookie': cookie,
				'Referer': `${mainUrl}${stuId}`,
			})
			.redirects(0);

		if (status === 200) {
			// writeToFile(text);
			const $ = cheerio.load(text);
			cheerioTableparser($);
			const timeInfo = $('#Table1').parsetable(false, false, false).slice(2);
			const year = $('#xnd option[selected]').val();
			const semester = $('#xqd option[selected]').val();
			const stuId = $('#Label5').text().split('：')[1].trim();
			const stuName = $('#Label6').text().split('：')[1].trim();
			const department = $('#Label7').text().split('：')[1].trim();
			const major = $('#Label8').text().split('：')[1].trim();
			const classId = $('#Label9').text().split('：')[1].trim();
			/*
			 *去除空格 无课程时间
			 */ 
				// [ [ "星期一", "计算机网络<br>周一第3,4,5节{第1-17周}<br>胡昔祥<br>6jxD302", "软件工程<br>周一第6,7节{第1-17周}<br>张万军<br>6jxD303", "软件工程<br>周一第8节{第1-17周}<br>张万军<br>6jxD303", "计算机网络课程实践<br>周一第10,11节{第1-17周}<br>胡昔祥<br>6jxB201" ], [ "星期二", "计算机组成原理<br>周二第3,4,5节{第1-17周}<br>郅跃茹<br>6jxB302", "Html5移动开发<br>{第1-17周|2节/周}<br>20139038|谢丽亚<br>6jxC309", "Html5移动开发<br>{第1-17周|1节/周}<br>20139038|谢丽亚<br>6jxC309" ], [ "星期三", "计算机组成原理课程实践<br>周三第1,2节{第1-17周}<br>郅跃茹<br>6jxB302", "形势与政策<br>周三第10,11节{第6-9周}<br>鞠婷<br>6jxC107" ], [ "星期四", "微信公众平台开发<br>{第1-17周|2节/周}<br>40383|葛瀛龙<br>6jxB302", "软件工程课程实践<br>周四第10,11节{第1-17周|双周}<br>张万军<br>6jxB102" ], [ "星期五", "XML语言及其应用<br>{第1-17周|2节/周}<br>06050|李钧<br>6jxB413" ], [ "星期六" ], [ "星期日" ] ]
			// const dataArr = inspectData(data);
				// { "Monday": { "total": 4, "courses": [ { "course": "计算机网络", "time": "周一第3,4,5节{第1-17周}", "teacher": "胡昔祥", "classroom": "6jxD302" }, { "course": "软件工程", "time": "周一第6,7节{第1-17周}", "teacher": "张万军", "classroom": "6jxD303" }, { "course": "软件工程", "time": "周一第8节{第1-17周}", "teacher": "张万军", "classroom": "6jxD303" }, { "course": "计算机网络课程实践", "time": "周一第10,11节{第1-17周}", "teacher": "胡昔祥", "classroom": "6jxB201" } ] }, "Tuesday": { "total": 3, "courses": [ { "course": "计算机组成原理", "time": "周二第3,4,5节{第1-17周}", "teacher": "郅跃茹", "classroom": "6jxB302" }, { "course": "Html5移动开发", "time": "{第1-17周|2节/周}", "teacher": "20139038|谢丽亚", "classroom": "6jxC309" }, { "course": "Html5移动开发", "time": "{第1-17周|1节/周}", "teacher": "20139038|谢丽亚", "classroom": "6jxC309" } ] }, "Wednesday": { "total": 2, "courses": [ { "course": "计算机组成原理课程实践", "time": "周三第1,2节{第1-17周}", "teacher": "郅跃茹", "classroom": "6jxB302" }, { "course": "形势与政策", "time": "周三第10,11节{第6-9周}", "teacher": "鞠婷", "classroom": "6jxC107" } ] }, "Thursday": { "total": 2, "courses": [ { "course": "微信公众平台开发", "time": "{第1-17周|2节/周}", "teacher": "40383|葛瀛龙", "classroom": "6jxB302" }, { "course": "软件工程课程实践", "time": "周四第10,11节{第1-17周|双周}", "teacher": "张万军", "classroom": "6jxB102" } ] }, "Friday": { "total": 1, "courses": [ { "course": "XML语言及其应用", "time": "{第1-17周|2节/周}", "teacher": "06050|李钧", "classroom": "6jxB413" } ] }, "Saturday": { "total": 0, "courses": [] }, "Sunday": { "total": 0, "courses": [] } }
			// const json = formatJSON(dataArr);
			
			/*
			 *保留空格 带时间
			 */
			const dataArr = parseToChinese(timeInfo);
			const res = parseJSON(dataArr);
			res.stuInfo = { stuId, stuName, department, major, classId, year, semester, };

			return res;
		} else {
			return false;
		}


	} catch (e) {
		console.error(e.stack);
		return false;
	}

}

async function getTimeByConditions(cookie, stuId) {
	try {
		const { status, text } = await superagent
			.get(`${timeTableUrl}${stuId}`)
			.charset('gb2312')
			.set(headerConfig)
			.set({
				'Cookie': cookie,
				'Content-Type': 'application/x-www-form-urlencoded',
				'Origin': 'http://jxgl.hziee.edu.cn',
				'Referer': `${timeTableUrl}${stuId}`,
			})
			.query({
				'__EVENTTARGET': 'xnd',
				'__EVENTARGUMENT': '',
				'__LASTFOCUS': '',
				'__VIEWSTATE': '/wEPDwUJODMwOTcyMjkyD2QWAgIBD2QWGAIBDw8WAh4EVGV4dAULMDIwMTUtMjAxNjFkZAICDxAPFgYeDURhdGFUZXh0RmllbGQFAnhuHg5EYXRhVmFsdWVGaWVsZAUCeG4eC18hRGF0YUJvdW5kZ2QQFQQJMjAxNy0yMDE4CTIwMTYtMjAxNwkyMDE1LTIwMTYAFQQJMjAxNy0yMDE4CTIwMTYtMjAxNwkyMDE1LTIwMTYAFCsDBGdnZ2cWAQIBZAIEDxBkZBYBZmQCBw8PFgIfAAUR5a2m5Y+377yaMTU5MDU3MTdkZAIJDw8WAh8ABRLlp5PlkI3vvJrmnY7nq4vlh69kZAILDw8WAh8ABRXlrabpmaLvvJrorqHnrpfmnLrns7tkZAINDw8WAh8ABRXkuJPkuJrvvJrova/ku7blt6XnqItkZAIPDw8WAh8ABRTooYzmlL/nj63vvJoxNTA5MjcxM2RkAhUPPCsACwEADxYIHghEYXRhS2V5cxYAHgtfIUl0ZW1Db3VudGYeCVBhZ2VDb3VudAIBHhVfIURhdGFTb3VyY2VJdGVtQ291bnRmZGQCFw88KwALAQAPFggfBBYAHwVmHwYCAR8HZmRkAhkPPCsACwEADxYIHwQWAB8FZh8GAgEfB2ZkZAIbDzwrAAsBAA8WCB8EFgAfBWYfBgIBHwdmZGRkdEThEujfRNkrMW9bV3d5MYgdnrU=',
				'__EVENTVALIDATION' :'/wEWCwKti/jjAQLOmbWVDAKZ8trqAwKe8p7VAgKf8qKVAwLOmbWVDALOmemVDALB9sN7AsD2w3sCw/bDewL+6YyoCr15G9Dsu8DSNimJ5RbHU5jdNs4Z',
				'xnd': '2017-2018',
				'xqd': 1,
			});

		if (status === 200) {
			// writeToFile(text);
			const $ = cheerio.load(text);
			cheerioTableparser($);
			const timeInfo = $('#Table1').parsetable(false, false, false).slice(2);
			const year = $('#xnd option[selected]').val();
			const semester = $('#xqd option[selected]').val();
			const stuId = $('#Label5').text().split('：')[1].trim();
			const stuName = $('#Label6').text().split('：')[1].trim();
			const department = $('#Label7').text().split('：')[1].trim();
			const major = $('#Label8').text().split('：')[1].trim();
			const classId = $('#Label9').text().split('：')[1].trim();
			
			const dataArr = parseToChinese(timeInfo);
			const res = parseJSON(dataArr);
			res.stuInfo = { stuId, stuName, department, major, classId, year, semester, };

			return res;
		} else {
			return false;
		}


	} catch (e) {
		console.error(e.stack);
		return false;
	}
}

/*===========================================updated=============================================*/
/**
 * [保留空格 转换为汉字]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
const parseToChinese = (data) => {
	const dataArr = [];
	data.forEach(item => {
		const temp = [];
		item.forEach(e => {
			if (e === '&#xA0;')
				temp.push('');
			else
				temp.push(he.decode(e));
		});
		dataArr.push(temp);
	});

	return dataArr;
}
/**
 * [带时间节点的格式]
 * @param  {[type]} dataArr [description]
 * @return {[type]}         [description]
 */
const parseJSON = (dataArr) => {
	const json = {
			stuInfo: {},
			timeTable: {
				Monday: { total: 0, courses: [], },
				Tuesday: { total: 0, courses: [], },
				Wednesday: { total: 0, courses: [], },
				Thursday: { total: 0, courses: [], },
				Friday: { total: 0, courses: [], },
				Saturday: { total: 0, courses: [], },
				Sunday: { total: 0, courses: [], },
			},
	};
	dataArr.forEach(full => {
		let key = '';
		const day = full[0].trim();
		const realData = full.slice(1);
		switch (day) {
			case '星期一': key = 'Monday'; break;
			case '星期二': key = 'Tuesday'; break;
			case '星期三': key = 'Wednesday'; break;
			case '星期四': key = 'Thursday'; break;
			case '星期五': key = 'Friday'; break;
			case '星期六': key = 'Saturday'; break;
			case '星期日': key = 'Sunday'; break;
		}
		
		let count = 0;
		realData.forEach((record, position) => {
			if (record.length > 0) {
				++count;
				const detail = record.split('<br>');
				//["计算机网络", "周一第3,4,5节{第1-17周}", "胡昔祥", "6jxD302"]
				//["Html5移动开发", "{第1-17周|2节/周}", "20139038|谢丽亚", "6jxC309"]
				let [ course, time, teacher, classroom ] = detail;
				// 是否必修
				const isRequired = teacher.includes('|') ? false : true;
				const type = isRequired ? '必修' : '选修';
				teacher = isRequired ? teacher : teacher.split('|')[1];
  				
				const { startTime, endTime, classCount } = getSchoolTime(isRequired, time, position);

				json.timeTable[key].courses.push({
					course, classroom, duration: `${startTime} ~ ${endTime}`, time,
					isRequired, type, teacher, position, startTime, endTime, classCount,
				});
			}
		});
		json.timeTable[key].total = count;
	});

	return json;
}
/**
 * [获取上课时间]
 * @param  {Boolean} isRequired [description]
 * @param  {[String]}  time       [description]
 * @param  {[Number]}  position   [选修课的开始节数]
 * @return {[type]}             [description]
 */
const getSchoolTime = (isRequired, time, position = 0) => {
  let startTime = '', endTime = '', classCount = 0;
  if (isRequired) {
  	// "周一第3,4,5节{第1-17周}"
    const pos1 = time.indexOf('第');
    const pos2 = time.indexOf('节');

    const turns = time.substring(pos1 + 1, pos2).trim().split(',');
    classCount = turns.length;
    const startPos = Number(turns[0]);
    const endPos = Number(turns[classCount - 1]);

    startTime = startTimes[startPos];
    endTime = endTimes[endPos];
  } else {
  	// "{第1-17周|2节/周}"
    const pos1 = time.indexOf('|');
    classCount = (Number)(time.substr(pos1 + 1, 1));
    
    startTime = startTimes[position];
    endTime = endTimes[position + classCount - 1];
  }

  return { startTime, endTime, classCount };

}

/*=======================================desperate=================================================*/
/**
 * [格式化为json]
 * @param  {[type]} dataArr [description]
 * @return {[type]}         [description]
 */
const formatJSON = (dataArr) => {
	const json = {
		Monday: { total: 0, courses: [], },
		Tuesday: { total: 0, courses: [], },
		Wednesday: { total: 0, courses: [], },
		Thursday: { total: 0, courses: [], },
		Friday: { total: 0, courses: [], },
		Saturday: { total: 0, courses: [], },
		Sunday: { total: 0, courses: [], },
	};

	dataArr.forEach(aDay => {
		let key = '';
		const day = aDay[0].trim();
		const realData = aDay.slice(1);
		switch (day) {
			case '星期一': key = 'Monday'; break;
			case '星期二': key = 'Tuesday'; break;
			case '星期三': key = 'Wednesday'; break;
			case '星期四': key = 'Thursday'; break;
			case '星期五': key = 'Friday'; break;
			case '星期六': key = 'Saturday'; break;
			case '星期日': key = 'Sunday'; break;
		}
		json[key].total = realData.length;
		realData.forEach(record => {
			const temp = record.split('<br>');
			const isRequired = temp[2].includes('|') ? false : true;
			json[key].courses.push({
				"course": temp[0] || '',
				"time": temp[1] || '',
				"teacher": isRequired ? temp[2] : temp[2].split('|')[1] || '',
				"classroom": temp[3] || '',
				"type": isRequired ? '必修' : '选修' || '',
			});
		});
	});

	return json;
}
/**
 * [去除空元素 并转换为汉字]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
const inspectData = (data) => {
	const dataArr = [];
	data.forEach(item => {
		const temp = [];
		item.forEach(e => {
			if (e != '' && e != '&#xA0;')
				temp.push(he.decode(e));
		});
		dataArr.push(temp);
	});

	return dataArr;
}
module.exports = {
	getTimeTable,
	getTimeByConditions,
}