const express = require('express');
const fs = require('fs');
const config = require('./config');
const path = require('path');

const favicon = require('serve-favicon');
const logger = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const expressSession = require('express-session');


const cookieParser = require('cookie-parser');
const log = require('./libs/logger')(module);

const app = express();
const server = require('http').createServer(app);

// connect socket
const io = require('./socket')(server, log);

app.locals.io = io;

server.listen(config.get('port'), () => console.log(`listening on ${config.get('port')}`));

app.engine('ejs', require('ejs-locals'));
app.set('views', __dirname + '/templates');
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json()); // тело запроса (POST body) помещает в req.body

app.use(cookieParser()) // куки парсит в req.cookies
app.use(require('./middleware/sendHttpError'));

app.use(favicon('public/icons/favicon.ico')); // возвращает favicon, если перешли по /favicon.ico
//app.use(express.static('public')); // роут на статические (неизменяемые) ресурсы из директории public
app.use(express.static(path.join(__dirname, '../client/build')));

