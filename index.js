const { APIAI_TOKEN } = require('./config');
const uuidv4 = require('uuid/v4');
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

const server = app.listen(5000, () => {
    console.log('Running on http://localhost:5000');
});
const io = require('socket.io')(server);
const apiai = require('apiai')(APIAI_TOKEN);

io.on('connection', function(socket) {
    console.log('User connected!');
    const randomId = uuidv4();

    socket.on('chat message', (text) => {
        console.log(`User say: ${text}!`);

        let apiaiReq = apiai.textRequest(text, { sessionId: randomId });
        // console.log(apiaiReq);

        apiaiReq.on('response', (response) => {
            let aiText = response.result.fulfillment.speech;

            console.log(`Bot reply: ${aiText}`);
            socket.emit('bot reply', aiText);
        });

        apiaiReq.on('error', (err) => {
            console.log(err);
        });

        apiaiReq.end();
    });

});

app.get('/', (req, res) => {
    res.sendFile('index.html');
});