const charset = require('superagent-charset');
const superagent = charset(require('superagent'));
const cheerio = require('cheerio');

const {
	loginUrl,
	loginConfig,
	teacherLoginConfig,
	headerConfig
} = require('../utils/config');

/**
 * [getCookie 获取Cookie]
 * @return {[type]} [description]
 */
async function getCookie() {
	const {
		headers
	} = await superagent.get(loginUrl);
	const cookie = headers['set-cookie'][0];

	return cookie;
}

async function teacherLogin(cookie, teacherId, password) {
	try {
		const {
			text,
			redirects,
			status
		} = await superagent
			.post(loginUrl)
			.type('form')
			.charset('gb2312')
			.set(headerConfig)
			.set('Cookie', cookie)
			.send(`__VIEWSTATE=%2FwEPDwUKLTY4Mjg3NzI5NGRkHb6ppClKCzNjspPZo5RhJd2eBHA%3D&__EVENTVALIDATION=%2FwEWCgLDqd%2BVAgLs0bLrBgLs0fbZDAK%2FwuqQDgKAqenNDQLN7c0VAuaMg%2BINAveMotMNAoznisYGArursYYIFhbjTihUHPPoe7ok9ErA9YWV8K0%3D&TextBox1=${teacherId}&TextBox2=${password}&RadioButtonList1=%BD%CC%CA%A6&Button1=`)

		if (status === 200 && redirects[0].includes(teacherId)) {
			return true
		} else {
			return false
		}

		return text

	} catch (e) {
		console.log(e.stack);
		return false;
	}
}
/**
 * [login 登录]
 * @param  {[Number]} stuId    	[description]
 * @param  {[String]} password 	[description]
 * @return {[type]}          	[description]
 */
async function login(ctx, cookie, stuId, password) {

	try {
		const {
			redirects,
			status,
			text
		} = await superagent
			.post(loginUrl)
			.type('form')
			.charset('gb2312')
			// .set(headerConfig)
			.set({
				'Cookie': cookie,
			})
			.send(loginConfig)
			.send({
				TextBox1: stuId,
				TextBox2: password,
			});

		// 请求成功 && 重定向成功 && url中包含学号 表示登录成功
		if (status === 200 && redirects[0].includes(stuId)) {
			const $ = cheerio.load(text);
			const stuName = $('#xhxm').text().split('同学')[0];

			return {
				success: true,
				stuName,
			};
		} else {
			return false;
		}

	} catch (e) {
		console.log(e.stack);
		return false;
	}

}


module.exports = {
	login,
	teacherLogin,
	getCookie,
}