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

app.get('/messages', bodyParser.text({type: '*/*'}), async (req, res) => {
    const request = http.request({
        host: 'httpserv',
        port: 8081,
        path: '/',
        method: 'GET',
        headers: {
           Accept: 'text/plain', 'Content-Type': "text/plain" 
        }
      }, function(response) {
        var data = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          data += chunk;
        });
        response.on('end', () => {
          res.setHeader("Content-Type", "text/plain");
          res.end(data);
        });
      });
      request.end();

})

app.put('/state', bodyParser.text({type: '*/*'}), async (req, res) => {
  const DATA = req.body
  let data = ''
  const HEADER = {
    headers: { Accept: 'text/plain', 'Content-Type': "text/plain"},
  }
  axios
    .put('http://orig:8082/changeState', DATA, HEADER)
    .then((response) => {
        data = response.data
        
    })
    .catch((e) => {
      console.error(e)
    })
  updateState(DATA)
  res.setHeader("Content-Type", "text/plain");
  res.end(currentState)
})

const updateState = (data) => {
  if(data === "INIT"){
    currentState = "RUNNING"
  } else {
    currentState = data
  }
  
}

app.get('/state', async (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.send(currentState);
})

app.get('/run-log', async (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.send(stateLog);
})


app.get('/node-statistic', async (req, res) => {
    let data = ''
    axios
    .get('http://guest:guest@rabbitmq:15672/api/nodes')
    .then((response) => {
          data = response.data
          const jsonObject = data[0]
          const statistics_data = { "fd_used" : jsonObject.fd_used,  "sockets_used" : jsonObject.sockets_used, "disk_free" : jsonObject.disk_free, "connection_created" : jsonObject.connection_created, "channel_created": jsonObject.channel_created}
          res.setHeader('content-type', 'application/json');
          res.send(statistics_data)
    })
    .catch((e) => {
        console.error(e)
        res.send(e)
    })

})

app.get('/queue-statistic', async (req, res) => {
  let data = []
  axios
    .get('http://guest:guest@rabbitmq:15672/api/queues/')
    .then((response) => {
      response.data.forEach((jsonObject) => {
          const message_delivery_rate = jsonObject.message_stats.deliver_get_details.rate
          const message_publish_rate = jsonObject.message_stats.publish_details.rate
          const messages_delivered_recently = jsonObject.message_stats.deliver_get
          const messages_published_recently = jsonObject.message_stats.publish

          const dataObj = { "message_delivery_rate":  message_delivery_rate, "message_publish_rate" : message_publish_rate, "messages_delivered_recently" : messages_delivered_recently, "messages_published_recently":  messages_published_recently}
          data.push(dataObj)



      })
      res.setHeader('content-type', 'application/json');
      res.send(data)

    })
    .catch((e) => {
      res.send(e)
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
