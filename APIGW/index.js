const express = require('express');
const app = express();
const port = 8083;
const http = require('http');
const bodyParser = require('body-parser')
const axios = require('axios')
let currentState = "";
let stateLog = "";
const fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/messages', async (req, res) => {
    const request = http.request({
        host: 'httpserv',
        port: 8081,
        path: '/',
        method: 'GET',
        headers: {
          
        }
      }, function(response) {
        var data = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          data += chunk;
        });
        response.on('end', () => {
          res.end(data);
        });
      });
      request.end();

})

app.put('/state', async (req, res) => {
  const { state } = req.body
  const DATA = {
    state
  }
  let data = ''
  const HEADER = {
    headers: { Accept: 'application/json' },
  }
  axios
    .put('http://orig:8082/changeState', DATA, HEADER)
    .then((response) => {
        console.log('Req body:', response.data)
        console.log('Req header :', response.headers)
        data = response.data
        console.log(data)
        
    })
    .catch((e) => {
      console.error(e)
    })
  updateState(state)
  console.log(currentState)
  res.end(currentState)
})

const updateState = (data) => {
  currentState = data
}

app.get('/state', async (req, res) => {
    console.log(currentState);
    res.setHeader('content-type', 'text/plain');
    res.send(currentState);
})

app.get('/run-log', async (req, res) => {
    res.setHeader('content-type', 'text/plain');
    res.send(stateLog);
})


app.get('/node-statistic', async (req, res) => {
    let data = ''
    axios
    .get('http://rabbitmq:15672/api/nodes', {
      auth: {
          username: "guest",
          password: "guest",
      }
    })
    .then((response) => {
          console.log('Req body:', response.data)
          console.log('Req header :', response.headers)
          data = response.data
          const jsonObject = data[0]
          console.log(jsonObject)
          const statistics_data = { "fd_used" : jsonObject.fd_used,  "sockets_used" : jsonObject.sockets_used, "disk_free" : jsonObject.disk_free, "connection_created" : jsonObject.connection_created, "channel_created": jsonObject.channel_created}
          console.log(statistics_data)
          res.setHeader('content-type', 'application/json');
          res.send(statistics_data)
    })
    .catch((e) => {
        console.error(e)
    })

})

app.listen(port, () => {
  const dateInit = new Date(Date.now());
  const timestampInit = dateInit.toISOString();
  currentState = "INIT";
  stateLog += timestampInit + " " + currentState + "\r\n";
  const dateRunning = new Date(Date.now());
  const timestampRunning = dateRunning.toISOString();
  currentState = "RUNNING";
  stateLog += timestampRunning + " " + currentState + "\r\n";
  console.log(`App listening on port ${port}`)
  //empty the existing file
  fs.truncate('./public/file.txt', 0, err => {
    if (err) {
      console.error(err);
    }
  });
})
