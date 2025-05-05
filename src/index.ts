import { WebSocketServer } from 'ws';
import { Add, MakeMove, Remove, RollDice } from './controller';
import { event4, event5, event7, event8 } from './constants';
import express from 'express';
import path from 'path'
import http from 'http';

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, '../' + '/public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '../' + '/public/index.html'))
})
const wss = new WebSocketServer({ server: server });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    const parsedMsg = JSON.parse(data.toString());
    const { event } = parsedMsg;

    if (parsedMsg.event == event4) {
      Add(ws, event);
    }
    else if (parsedMsg.event == event7) {
      MakeMove(parsedMsg.gameid, parsedMsg.cid, ws, parsedMsg.tileid);
    }
    else if (parsedMsg.event == event8) {
      RollDice(parsedMsg.gameid, parsedMsg.cid, ws);
    }
    else if (parsedMsg.event == event5) {
      Add(ws, event5, parsedMsg.gameid)
    }
  });

  ws.on("close", () => {
    Remove(ws);
  });

  ws.send('something');
});


// Start both servers
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is listening on PORT:${PORT}`);
});