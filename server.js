const express = require('express');
const app = express();
const db = require('./db.js');

app.get('/', (req, res) => {
    res.send("Hello World!")
});


app.listen(process.env.PORT || '8080', () => console.log('Server is running on port 8080'))
