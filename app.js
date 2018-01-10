const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('koa2-cors');

const { writeToFile } = require('./utils/utils');

// const index = require('./routes/index');
const timeTable = require('./routes/timeTable');
const exam = require('./routes/exam');
const teacher = require('./routes/teacher');

// error handler
onerror(app);

// middlewares
app.use(json());
app.use(logger());
app.use(cors());

app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {
  extension: 'pug'
}));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});
app.use(bodyParser());

// routes
// app.use(index.routes(), index.allowedMethods());
app.use(timeTable.routes(), timeTable.allowedMethods());
app.use(exam.routes(), exam.allowedMethods());
app.use(teacher.routes(), teacher.allowedMethods());

module.exports = app;
