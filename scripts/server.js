#!/usr/bin/env node
/**
 * Servidor local leve e sem dependências para o Vitrine Indoor IA.
 * Suporta streaming de vídeo com HTTP Range Requests (necessário para MP4 no Chrome/Edge).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const ROOT_DIR = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const cleanUrl = req.url.split('?')[0];
  let relativePath = decodeURIComponent(cleanUrl);

  if (relativePath === '/' || relativePath === '') {
    relativePath = '/index.html';
  } else if (relativePath === '/auditor' || relativePath === '/auditor/') {
    relativePath = '/auditor/index.html';
  }

  const safePath = path.normalize(path.join(ROOT_DIR, relativePath));

  if (!safePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`404 Not Found: ${relativePath}`);
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Suporte a HTTP Range para video MP4
    const range = req.headers.range;
    if (range && ext === '.mp4') {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunksize = end - start + 1;

      const stream = fs.createReadStream(safePath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType
      });
      stream.pipe(res);
      return;
    }

    res.writeHead(200, {
      'Content-Length': stats.size,
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes'
    });
    fs.createReadStream(safePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`📺 Vitrine Indoor IA - Servidor de Desenvolvimento`);
  console.log(`=======================================================`);
  console.log(`- Player Principal:  http://localhost:${PORT}/`);
  console.log(`- Auditor V4.3:     http://localhost:${PORT}/auditor/`);
  console.log(`- Raiz dos arquivos: ${ROOT_DIR}`);
  console.log(`=======================================================`);
  console.log(`Pressione Ctrl+C para encerrar.`);
});
