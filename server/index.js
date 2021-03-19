const express = require('express');
const fs = require('fs');
var path = require('path');

const port = 4000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../front-end/build')));
app.use(express.static(path.join(__dirname, './dataSet_100per')));

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", " Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../front-end/build', 'index.html'));
});

app.get('/api/system-info', (req, res) => {
  console.log('/api/system-info');
  const systemInfo = JSON.parse(fs.readFileSync(__dirname + '\\src\\config\\system-info.json'));
  res.json(systemInfo);
});

app.get('/api/strokes-list', (req, res) => {
  console.log('/api/strokes-list');
  const { characters } = JSON.parse(fs.readFileSync(__dirname + '\\src\\config\\strokes-list.json'));
  if (!characters) res.end();
  const { id } = req.query;
  const char = characters.find((item) => {
    return (item.cId.toString() === id)
  });
  res.json(char.strokes);
});


app.get('/api/character-info', (req, res) => {
  console.log('/api/character-info');
  const { id } = req.query;
  const { dataSetId } = JSON.parse(fs.readFileSync(`${__dirname}\\src\\config\\system-info.json`));
  const images = JSON.parse(fs.readFileSync(__dirname + `\\dataSet_100per\\${dataSetId}\\images.json`));
  const img = images.images.find((item) => {
    return (item.id.toString() === id)
  });
  const imgJson = {
    total: images.sum,
    img
  }
  res.json(imgJson);
});

app.post('/api/save-data', (req, res) => {
  console.log('/api/save-data');
  const id = req.body.dataSetId;
  fs.copyFile('./result/data.json', `./result/data_${id}.json`, (err, result) => {
    if (err) {
      res.end("error" + err);
      return console.error(err);
    } else {
      const newData = {
        dataSetId: req.body.dataSetId + 1,
        currentImageId: 1,
        author: req.body.author
      };
      fs.writeFile(`${__dirname}\\src\\config\\system-info.json`, JSON.stringify(newData), (err, result) => {  // WRITE
        if (err) {
          res.end("error" + err);
          return console.error(err);
        } else {
          const initData = {
            content: []
          };
          fs.writeFile('./result/data.json', JSON.stringify(initData), (err, result) => {  // WRITE
            if (err) {
              res.end("error" + err);
              return console.error(err);
            } else {
              res.end("success");
            }
          });
        }
      });
    }
  })
});




app.post('/api/submit', (req, res) => {
  console.log('/api/submit');
  const nextImage = () => {
    fs.readFile(`${__dirname}\\src\\config\\system-info.json`, (err, data) => {  // READ
      if (err) {
          res.end("error" + err);
          return console.error(err);
      };
      const newData = JSON.parse(data.toString());
      newData.currentImageId = req.body.currentImageId + 1;
      newData.author = req.body.author;
      const writeData = fs.writeFile(`${__dirname}\\src\\config\\system-info.json`, JSON.stringify(newData), (err, result) => {  // WRITE
          if (err) {
            res.end("error"+ err);
            return console.error(err);
          } else {
            res.end("success");
          }
      });
    });    
  }
  fs.readFile(`${__dirname}\\result\\data.json`, (err, data) => {  // READ
    if (err) {
        res.end("error"+ err);
        return console.error(err);
    };
    // console.log(data);
    const newData = JSON.parse(data.toString());
    newData.content.push(req.body);
    const writeData = fs.writeFile(`${__dirname}\\result\\data.json`, JSON.stringify(newData), (err, result) => {  // WRITE
        if (err) {
          res.end("error"+ err);
          return console.error(err);
        } else {
          nextImage();
        }
    });
  });
})




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

