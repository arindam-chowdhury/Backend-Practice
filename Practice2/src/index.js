const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();

// log only 4xx and 5xx messages to the console
app.use(morgan('dev', {
    skip: function (req, res) {
        return res.statusCode < 400;
    }
}));

//log all requests to access.log file
app.use(morgan('common', {
    stream: fs.createWriteStream(path.join(__dirname, 'assess.log'), {flags: 'a'})
}));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(5000, () => {
    console.log('Example app listening on port 3000!');
});