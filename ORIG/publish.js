const amqplib = require('amqplib');
const timers = require('timers-promises')
const exchangeName = "topic_logs";
const msg = 'MSG';
const key = 'compse140.o';
var messageCount = 0;
let currentState = "INIT";
const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser')
const port = 8082;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sending a message to topic compse140.o
const sendMsg = async (message) => {
    const connection = await amqplib.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'topic', {durable: false});
    channel.publish(exchangeName, key, Buffer.from(message));
    console.log('Sent: ', message);
}

// Start operation with message count. Message count is incremented before sending a message.
const start = async (messageCount) => {
    if(currentState === "INIT"){
        await timers.setTimeout(5000);
        currentState = "RUNNING"
        messageCount = 0
    }

    while(currentState === "RUNNING"){
            messageCount++;
            updateMessageCount(messageCount)
            await sendMsg(msg + "_" + messageCount);
            await timers.setTimeout(3000);
    }

}

//Updating the message count
const updateMessageCount = (count) => {
    messageCount = count
}

// Change the application state
app.put('/changeState', bodyParser.text({type: '*/*'}), async (req, res) => {
    const state = req.body
    console.log(state)
    if (state !== currentState){
        currentState = state
        start(messageCount)
    }
    res.setHeader("Content-Type", "text/plain");
    res.send(currentState)
})

app.listen(port, () => {  
    console.log(`App listening on port ${port}`)
})


start(messageCount)