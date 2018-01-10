const fs = require('fs');
const util = require('util');
const loadash = require('lodash');
const he = require('he')

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
 * [连字符转驼峰]
 * stu_id --> stuId
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
const hyphenToHump = (str) => {
	return str.replace(/_(\w)/g, (...args) => {
		return args[1].toUpperCase();
	});
}
/**
 * [驼峰转连字符]
 * stuId -> stu_id
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
const humpToHyphen = (str) => {
	return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

/**
 * [将流写入文件中]
 * @param  {[type]} content [description]
 * @return {[type]}         [description]
 */
const writeToFile = (content) => {
	const time = new Date();
	const year = time.getFullYear();
	const month = time.getMonth() + 1;
	const date = time.getDate();
	const fileName = `logs/${year}-${month}-${date}.log`;
	fs.writeFile(fileName, util.inspect(content));
	// let writer = fs.appendFile(fileName, content);
	// writer.write(util.inspect(content));
	// writer.write((String)(content));
	// writer.end();
}
/**
 * [去除数组重复元素]
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
const uniq = (arr) => Array.from(new Set(...arr));

/**
 * [从数组中删除特定元素]
 * @param  {[type]} arr [description]
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
const delElemOfArr = (arr, key) => {
	arr.forEach(e => {
		if (e === key) {
			arr.splice(arr.indexOf(e), 1);
		}
	});

	return arr;
}







// 去除重复 && 空元素
// [ [ "星期一", "", "", "", "计算机网络周一第3,4,5节{第1-17周}胡昔祥6jxD302", "", "", "软件工程周一第6,7节{第1-17周}张万军6jxD303", "", "软件工程周一第8节{第1-17周}张万军6jxD303", "", "计算机网络课程实践周一第10,11节{第1-17周}胡昔祥6jxB201", "", "" ], [ "星期二", "", "", "", "计算机组成原理周二第3,4,5节{第1-17周}郅跃茹6jxB302", "", "", "Html5移动开发{第1-17周|2节/周}20139038|谢丽亚6jxC309", "", "Html5移动开发{第1-17周|1节/周}20139038|谢丽亚6jxC309", "", "", "", "" ], [ "星期三", "", "计算机组成原理课程实践周三第1,2节{第1-17周}郅跃茹6jxB302", "", "", "", "", "", "", "", "", "形势与政策周三第10,11节{第6-9周}鞠婷6jxC107", "", "" ], [ "星期四", "", "", "", "微信公众平台开发{第1-17周|2节/周}40383|葛瀛龙6jxB302", "", "", "", "", "", "", "软件工程课程实践周四第10,11节{第1-17周|双周}张万军6jxB102", "", "" ], [ "星期五", "", "", "", "", "", "", "XML语言及其应用{第1-17周|2节/周}06050|李钧6jxB413", "", "", "", "", "", "" ], [ "星期六", "", "", "", "", "", "", "", "", "", "", "", "", "" ], [ "星期日", "", "", "", "", "", "", "", "", "", "", "", "", "" ] ];
// [ [ "星期一", "计算机网络周一第3,4,5节{第1-17周}胡昔祥6jxD302", "软件工程周一第6,7节{第1-17周}张万军6jxD303", "软件工程周一第8节{第1-17周}张万军6jxD303", "计算机网络课程实践周一第10,11节{第1-17周}胡昔祥6jxB201" ], [ "星期二", "计算机组成原理周二第3,4,5节{第1-17周}郅跃茹6jxB302", "Html5移动开发{第1-17周|2节/周}20139038|谢丽亚6jxC309", "Html5移动开发{第1-17周|1节/周}20139038|谢丽亚6jxC309" ], [ "星期三", "计算机组成原理课程实践周三第1,2节{第1-17周}郅跃茹6jxB302", "形势与政策周三第10,11节{第6-9周}鞠婷6jxC107" ], [ "星期四", "微信公众平台开发{第1-17周|2节/周}40383|葛瀛龙6jxB302", "软件工程课程实践周四第10,11节{第1-17周|双周}张万军6jxB102" ], [ "星期五", "XML语言及其应用{第1-17周|2节/周}06050|李钧6jxB413" ], [ "星期六" ], [ "星期日" ] ]
// const dataArr = cleanArrData(data);
// 转换为json格式
// [ [ "星期一", "计算机网络周一第3,4,5节{第1-17周}胡昔祥6jxD302", "软件工程周一第6,7节{第1-17周}张万军6jxD303", "软件工程周一第8节{第1-17周}张万军6jxD303", "计算机网络课程实践周一第10,11节{第1-17周}胡昔祥6jxB201" ], [ "星期二", "计算机组成原理周二第3,4,5节{第1-17周}郅跃茹6jxB302", "Html5移动开发{第1-17周|2节/周}20139038|谢丽亚6jxC309", "Html5移动开发{第1-17周|1节/周}20139038|谢丽亚6jxC309" ], [ "星期三", "计算机组成原理课程实践周三第1,2节{第1-17周}郅跃茹6jxB302", "形势与政策周三第10,11节{第6-9周}鞠婷6jxC107" ], [ "星期四", "微信公众平台开发{第1-17周|2节/周}40383|葛瀛龙6jxB302", "软件工程课程实践周四第10,11节{第1-17周|双周}张万军6jxB102" ], [ "星期五", "XML语言及其应用{第1-17周|2节/周}06050|李钧6jxB413" ], [ "星期六" ], [ "星期日" ] ]
// [ { "dayOfWeek": "星期一", "courses": [ "计算机网络周一第3,4,5节{第1-17周}胡昔祥6jxD302", "软件工程周一第6,7节{第1-17周}张万军6jxD303", "软件工程周一第8节{第1-17周}张万军6jxD303", "计算机网络课程实践周一第10,11节{第1-17周}胡昔祥6jxB201" ], "totalCourse": 4 }, { "dayOfWeek": "星期二", "courses": [ "计算机组成原理周二第3,4,5节{第1-17周}郅跃茹6jxB302", "Html5移动开发{第1-17周|2节/周}20139038|谢丽亚6jxC309", "Html5移动开发{第1-17周|1节/周}20139038|谢丽亚6jxC309" ], "totalCourse": 3 }, { "dayOfWeek": "星期三", "courses": [ "计算机组成原理课程实践周三第1,2节{第1-17周}郅跃茹6jxB302", "形势与政策周三第10,11节{第6-9周}鞠婷6jxC107" ], "totalCourse": 2 }, { "dayOfWeek": "星期四", "courses": [ "微信公众平台开发{第1-17周|2节/周}40383|葛瀛龙6jxB302", "软件工程课程实践周四第10,11节{第1-17周|双周}张万军6jxB102" ], "totalCourse": 2 }, { "dayOfWeek": "星期五", "courses": [ "XML语言及其应用{第1-17周|2节/周}06050|李钧6jxB413" ], "totalCourse": 1 }, { "dayOfWeek": "星期六", "courses": [], "totalCourse": 0 }, { "dayOfWeek": "星期日", "courses": [], "totalCourse": 0 } ];
// const jsonArr = parseArrToJSON(dataArr);
// 
/**
 * [去除重复元素 去除空元素]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
const cleanArrData = (data) => {
	const cloneData = loadash.cloneDeep(data);
	const pureData = [];

	cloneData.forEach((item) => {
		const t = delElemOfArr(uniq(item), '');
		pureData.push(t);
	});

	return pureData;
}

/**
 * [将课表数组转换为json数组]
 * @param  {[type]} dataArr [description]
 * @return {[type]}         [description]
 */
const parseArrToJSON = (dataArr) => {
	const jsonArr = [];

	dataArr.forEach((aDay) => {
		const json = {
			dayOfWeek: aDay[0],
			courses: [],
			totalCourse: aDay.length - 1,
		}
		const temp = aDay.slice(1);
		for (let i in temp) {
			json.courses.push(temp[i]);
		}

		jsonArr.push(json);
	});

	return jsonArr;
}



module.exports = {
	writeToFile,
	uniq,
	delElemOfArr,
	cleanArrData,
	parseArrToJSON,
	hyphenToHump,
	humpToHyphen,
	parseToChinese
}