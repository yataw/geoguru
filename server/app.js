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
const MongoStore = require('connect-mongo')(session);
const mongoose = require('./libs/mongoose');

const cookieParser = require('cookie-parser');
const sessionStore = require('./libs/sessionStore');
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
/*
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
*/

app.use(cookieParser()) // куки парсит в req.cookies
app.use(session({ // можно расширять этот объект. Значения будут сохранять до тех пор, пока актуальна кука
  secret: config.get('session:secret'),
  key: config.get('session:key'),
  store: sessionStore
}));

app.use((req, res, next) => {
  req.session.numberOfVisits = req.session.numberOfVisits + 1 || 1;

  next();
});

// app.use(require('./middleware/loadUser'));

app.use(require('./middleware/sendHttpError'));

app.use(favicon('public/icons/favicon.ico')); // возвращает favicon, если перешли по /favicon.ico
//app.use(express.static('public')); // роут на статические (неизменяемые) ресурсы из директории public
app.use(express.static(path.join(__dirname, '../client/build')));

require('./routes')(app); // подключение rout'ов



// Middleware
//app.use(cookieParser());


/*app.use((req, res, next) => {
  if (req.url === '/') {
    fs.readFile('index.html', (err, data) => {
      err ? next(err) : res.end(data);
    })
  } else next();
});

app.use((req, res, next) => {
  if (req.url === '/home') {
    res.end('HOME');
  } else next();
});

app.use((req, res, next) => {
  if (req.url === '/client/socket.io.js') {
    fs.readFile(__dirname + '\\client\\socket.io.js', (err, data) => {
      err ? next(err) : res.end(data);
    })
  } else next();
});

app.use((req, res, next) => {
  if (req.url === '/forbidden') {
    next(new Error('forbidden resource'));
  } else next();
});*/

