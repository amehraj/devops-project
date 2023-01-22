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

//Get all the messages that were written in the file from the HTTPSERV service
app.get('/messages', bodyParser.text({type: '*/*'}), async (req, res) => {
  const shutDown = checkShutdown()
    if(shutDown){
      res.setHeader("Content-Type", "text/plain");
      res.send("SERVICES ARE DOWN")
    } else {
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
    }
})

// send request to ORIG service to update the state
app.put('/state', bodyParser.text({type: '*/*'}), async (req, res) => {
  const shutDown = checkShutdown()
  if(shutDown){
    res.setHeader("Content-Type", "text/plain");
    res.send("SERVICES ARE DOWN")
  } else {
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
  }

})

// Update state helper function
const updateState = (data) => {
  if(data === "INIT"){
    currentState = "RUNNING"
  } else {
    currentState = data
  }
  
}

// Check if the system is shut down helper function.
const checkShutdown = (res) => {
  if(currentState === "SHUTDOWN"){
    return true
  } else {
    return false
  }
}

// Get current state of the application
app.get('/state', async (req, res) => {
  const shutDown = checkShutdown()
  if(shutDown){
    res.setHeader("Content-Type", "text/plain");
    res.send("SERVICES ARE DOWN")
  } else{
    res.setHeader('Content-Type', 'text/plain');
    res.send(currentState);
  }

})

// Get running log of the application
app.get('/run-log', async (req, res) => {
  const shutDown = checkShutdown()
  if(shutDown){
    res.setHeader("Content-Type", "text/plain");
    res.send("SERVICES ARE DOWN")
  } else {
    res.setHeader('Content-Type', 'text/plain');
    res.send(stateLog);
  }

})

//Get top 5 node statistics from RabbitMQ API
app.get('/node-statistic', async (req, res) => {
  const shutDown = checkShutdown()
  if(shutDown){
    res.setHeader("Content-Type", "text/plain");
    res.send("SERVICES ARE DOWN")
  } else {
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
  }


})
//Get queue statistic for each queue, from RabbitMQ API
app.get('/queue-statistic', async (req, res) => {
  const shutDown = checkShutdown()
  if(shutDown){
    res.setHeader("Content-Type", "text/plain");
    res.send("SERVICES ARE DOWN")
  } else {
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
  }
})

app.listen(port, () => {
  // Initial starting time
  const dateInit = new Date(Date.now());
  const timestampInit = dateInit.toISOString();
  // Initial state when starting
  currentState = "INIT";
  stateLog += timestampInit + " " + currentState + "\r\n";
  // Running time
  const dateRunning = new Date(Date.now());
  const timestampRunning = dateRunning.toISOString();
  // Change to running state
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
