const express = require('express');
const path = require('path');

const server = express();

server.use(express.static(path.resolve(__dirname, '..', 'client_dist')));

server.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'client_dist', 'index.html'));
});

server.listen(3000, 'localhost', () => {
  console.log('server running on http://localhost:3000');
});