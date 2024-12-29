import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import { initializeDatabase } from './config/database.js';
import { initializeSocket } from './socket.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);
const io = new Server(server);

// Serve arquivos estáticos do frontend
const frontendPath = join(__dirname, '../../frontend/public');
app.use(express.static(frontendPath));

// Rota principal
app.get('/', (req, res) => {
  // res.sendFile(join(frontendPath, 'index.html'));
  res.header('Access-Control-Allow-Origin', 'https://chat-socket-io-dusky.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
});

const db = await initializeDatabase();
initializeSocket(io, db);

const PORT = 3333;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});