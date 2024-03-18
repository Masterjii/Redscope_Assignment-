
import express from 'express';
import fs from "fs";
import path from 'path';
import { dataFolderName } from './constants.js'

const __dirname = path.resolve();

const startHttpServer = () => {
  const app = express();
  app.use(express.static('public'));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.get('/rrweb-events', (req, res) => {
    res.sendFile((__dirname + '/public/rrweb_events.html'));
  });

  // Endpoint to save URL to its own file
  app.post('/save-url', (req, res) => {
    const { url } = req.body;
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({ error: 'ID parameter is required' });
    }

    const filePath = path.join(dataFolderName, `${id}.txt`);

    fs.writeFile(filePath, url, err => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to save URL' });
        }
        res.json({ message: 'URL saved successfully' });
    });
  });

  // Endpoint to retrieve URL based on id
  app.get('/get-url', (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({ error: 'ID parameter is required' });
    }

    const filePath = path.join(dataFolderName, `${id}.txt`);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(404).json({ error: 'URL not found' });
        }
        res.json({ url: data });
    });
  });

  const port = 3000;
  app.listen(port, () => console.log(`Server listening on port ${port}`));
}

export {
  startHttpServer
}

// ---------------------------------------------------------------------------------------------------------------------------------------------

// In this modified code:

// Two new endpoints /save-url and /get-url are added for saving and retrieving URLs, respectively.
// The save-url endpoint receives a POST request with a URL in the request body and saves it to a file named after the provided id.
// The get-url endpoint retrieves the URL from the file corresponding to the provided id.

// ---------------------------------------------------------------------------------------------------------------------------------------------

// import express from 'express';
// import fs from "fs";
// import path from 'path';
// import { dataFolderName } from './constants.js'

// const __dirname = path.resolve();


// const startHttpServer = () => {
//   const app = express();  
//   app.use(express.static('public'));

//   app.get('/rrweb-events', (req, res) => {
//     res.sendFile((__dirname + '/public/rrweb_events.html'));  
//   });

//   // Nested routing (api/rrweb_events) is a bit tricky, leaving for the take home assignment
//   app.get('/api-rrweb-events', (req, res) => {
//     return res.send(fetchRrwebEvents(1));  
//   });

//   const port = 3000;
//   app.listen(port, () => console.log(`Server listening on port ${port}`));
// }

// const fetchRrwebEvents = (id) => {
//   const dataFilePath = path.join(dataFolderName, id.toString())  
//   const rrwebEvents = fs.readFileSync(dataFilePath, 'utf-8');
//   return rrwebEvents.split("\n").filter(line => line.length > 0).map(ff => JSON.parse(ff));
// }

// export {
//   startHttpServer  
// }

// -------------------------------------------------------------------------------------------------------------------------------------------
