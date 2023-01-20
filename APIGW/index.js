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
  const response = await axios.get("http://httpserv:8081/")
  res.end(response.data)

})

app.put('/state', async (req, res) => {
  const { state } = req.body
  const DATA = {
    state
  }
  const HEADER = {
    headers: { Accept: 'application/json' },
  }
  const response = await axios.put("http://orig:8082/changeState", DATA, HEADER)
  updateState(response.data)

  console.log(state)
  res.end(state)
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
  fs.truncate('./public/file.txt', 0, err => {
    if (err) {
      console.error(err);
    }
  });
})
