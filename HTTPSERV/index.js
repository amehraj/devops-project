const express = require('express');
const app = express();
const port = 8081;
const fs = require('fs');

// Read file and show data to user
app.get('/', async (req, res) => {
    fs.readFile('./public/file.txt', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        res.setHeader('Content-Type', 'text/plain');
        res.send(data);
      });

})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
