

import { WebSocketServer } from 'ws';
import fs from 'fs-extra';
import { dataFolderName } from './constants.js'
import path from "path";

let lastUrl = null;
let id = 1;
let sessionId = null; // Initialize sessionId

const startWebSocketServer = () => {
  const wss = new WebSocketServer({ port: 3008 });
  wss.on('connection', (ws) => {
    console.log('WebSocket connection established.');

    // Handle incoming messages
    ws.on('message', (message) => {
      const payload = JSON.parse(message.toString());

      // Check if payload has sessionId
      if (!sessionId && payload.sessionId !== null) {
        sessionId = payload.sessionId; // Assign sessionId from the payload
        console.log(`Session started with sessionId: ${sessionId}`);
      } else if (payload.sessionId === null) {
        sessionId = null; // Reset sessionId if sessionId is null
        console.log("Session stopped");
      }

      processPayload(payload);
    });
  });
};

const processPayload = (payload) => {
  const { type, url, data } = payload;
  console.log("*".repeat(80));
  console.log( {type, url, payload} );
  console.log("*".repeat(80));

  // Check if sessionId exists and the payload is of type 'rrweb events'
  if (!sessionId || type !== 'rrweb events') {
    return;
  }

  const jsonData = JSON.parse(data);

  let dataFilePath;
  if (url === lastUrl) {
    dataFilePath = path.join(dataFolderName, `${sessionId}_${id.toString()}`); // Include sessionId in the file name
    fs.writeJsonSync(dataFilePath, jsonData, { flag: 'a' });
  } else {
    dataFilePath = path.join(dataFolderName, `${sessionId}_${id.toString()}`); // Include sessionId in the file name
    fs.writeJsonSync(dataFilePath, jsonData); // This would empty the files if there's already content
  }

  lastUrl = url;
};

export {
  startWebSocketServer,
};



// ----------------------------------------------------------------------------------------------------------------

// Explanation:
//1. sessionId variable is initialized to null initially. This variable will hold the sessionId associated with the session.
//2. In the WebSocket connection handler, when a message is received, the code checks if the payload contains a sessionId. If yes, it assigns the sessionId from the payload.
//3. If the sessionId received is null, it means the session has stopped, so the sessionId variable is reset to null.
//4. In the processPayload function, it first checks if sessionId exists and if the payload type is 'rrweb events'. If either condition is not met, it returns early, meaning it won't process the payload.
//5. The filename where the data is stored is modified to include the sessionId, ensuring that data for different sessions is stored separately.