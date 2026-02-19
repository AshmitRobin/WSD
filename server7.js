const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = 3000;
const FILE = 'data.json';

function getData() {
  if (!fs.existsSync(FILE)) {
    const init = {
      artists: [],
      songs: [],
      albums: [],
      genres: [],
      playlists: [],
      labels: [],
      awards: []
    };
    fs.writeFileSync(FILE, JSON.stringify(init, null, 2));
    return init;
  }
  return JSON.parse(fs.readFileSync(FILE));
}

function saveData(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const path = parsed.pathname;
  const method = req.method;

  if (path === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(fs.readFileSync('index.html'));
  }

  const match = path.match(/^\/api\/(\w+)/);
  if (!match) {
    res.writeHead(404);
    return res.end('Not Found');
  }

  const module = match[1];
  const data = getData();

  if (!data[module]) {
    res.writeHead(404);
    return res.end('Invalid Module');
  }

  // GET
  if (method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(data[module]));
  }

  // POST
  if (method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const newItem = JSON.parse(body);
      newItem.id = Date.now();
      data[module].push(newItem);
      saveData(data);
      res.writeHead(200);
      res.end();
    });
    return;
  }

  // DELETE
  if (method === 'DELETE') {
    const id = parseInt(parsed.query.id);
    data[module] = data[module].filter(item => item.id !== id);
    saveData(data);
    res.writeHead(200);
    res.end();
    return;
  }

}).listen(PORT, () => {
  console.log("Server running at http://localhost:3000");
});
