const express = require('express');
const fs = require('fs');
const path = require('path');
const logger = require('morgan');

// TODO add favicon
const log = require('./logger')(module);
const bodyParser = require('body-parser');

const app = express();
const server = require('http').createServer(app);

// connect socket
const io = require('./socket')(server, log);

const port =  process.env.PORT;

app.locals.io = io;
server.listen(port, () => console.log(`listening on ${port}`));

app.use(logger('dev'));
app.use(bodyParser.json()); // тело запроса (POST body) помещает в req.body
app.use(require('./middleware/sendHttpError'));

// TODO add favicon
// app.use(favicon('public/icons/favicon.ico')); // возвращает favicon, если перешли по /favicon.ico
app.use(express.static(path.join(__dirname, '../../build'))); // роут на статические (неизменяемые) ресурсы из директории public
