const express = require('express');
const appRouter = require('./app.router');

const app = express();

app.use(appRouter);

module.exports = app;
