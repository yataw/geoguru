const express = require('express');
const fs = require('fs');
const config = require('./config');
const path = require('path');
const logger = require('morgan');

// TODO add favicon
// const favicon = require('serve-favicon');
const log = require('./logger')(module);
// const methodOverride = require('method-override');
// const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const server = require('http').createServer(app);

// connect socket
const io = require('./socket')(server, log);
const port =  process.env.PORT || config.get('port');

app.locals.io = io;
server.listen(port, () => console.log(`listening on ${port}`));

app.use(logger('dev'));
app.use(bodyParser.json()); // тело запроса (POST body) помещает в req.body
app.use(cookieParser()); // куки парсит в req.cookies
app.use(require('./middleware/sendHttpError'));

// TODO add favicon
// app.use(favicon('public/icons/favicon.ico')); // возвращает favicon, если перешли по /favicon.ico
app.use(express.static(path.join(__dirname, '../../build'))); // роут на статические (неизменяемые) ресурсы из директории public

// app.use(express.static(path.join(__dirname, '../client/build')));