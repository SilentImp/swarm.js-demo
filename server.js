"use strict";

var http = require('http')
    , ws_lib = require('ws')
    , swarm = require('swarm')
    , Text = require('swarm/lib/Text')
    , file_storage = new swarm.FileStorage('storage')
    , swarm_host = new swarm.Host('swarm~nodejs', 0, file_storage)
    , app = new Text('APP')
    , http_server
    , ws_server;

app.on('init', function () {
    console.log('model init: ', app.text);
});

app.on('set', function () {
    console.log('model update: ', app.text);
});


http_server = http.createServer();
http_server.listen(8000);

ws_server = new ws_lib.Server({ server: http_server });
ws_server.on('connection', function (ws) {
    console.log('new incoming WebSocket connection');
    swarm_host.accept(new swarm.EinarosWSStream(ws), { delay: 50 });
});
