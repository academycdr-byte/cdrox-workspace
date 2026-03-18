import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const server = http.createServer((req, res) => {
  let url = req.url === '/' ? '/index.html' : req.url;
  let filePath = path.join(__dirname, url);

  if (!fs.existsSync(filePath) && !path.extname(url)) {
    filePath = filePath + '.html';
  }

  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath);
    const types = { '.html': 'text/html; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json' };
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found: ' + req.url);
  }
});

server.listen(3457, () => console.log('Server running on http://localhost:3457'));
