require('./config/db');

const express = require('express');
const bodyParser = express.json;
const cors = require("cors");
const routes = require('./index1');
const app = express();

app.use(cors());
app.use(bodyParser());
app.use('/api/v1', routes);
module.exports = app;