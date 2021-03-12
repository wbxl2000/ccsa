const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, '../font-end/build')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../font-end/build', 'index.html'));
});

app.listen(9000);