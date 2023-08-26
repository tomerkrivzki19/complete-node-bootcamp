const express = require('express');
const app = express();

const port = 3000;

// example of reqest
app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'hello from the server side', app: 'Natours' });
});

app.post('/', (req, res) => {
  res.send('You can post to do this endpoint ....');
});

app.listen(port, () => {
  console.log(`app runing on port ${port}...`);
});
