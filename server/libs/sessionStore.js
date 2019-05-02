const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

module.exports = new MongoStore({mongooseConnection:mongoose.connection});