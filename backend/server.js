import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { availableParallelism } from 'node:os';
import cluster from 'node:cluster';
import { createAdapter, setupPrimary } from '@socket.io/cluster-adapter';

if (cluster.isPrimary) {
  const numCPUs = availableParallelism();
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({
      PORT: process.env.PORT || 3000
    });
  }

  setupPrimary();
} else {
  const db = await open({
    filename: 'chat.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_offset TEXT UNIQUE,
      content TEXT
    );
  `);

  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {},
    adapter: createAdapter(),
    cors: {
      origin: ["https://chat-socket-io-dusky.vercel.app", "http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://chat-socket-io-dusky.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });

  io.on('connection', async (socket) => {
    console.log('Um usuário conectou:', socket.id);

    socket.on('chat message', async (msg, clientOffset, callback) => {
      let result;
      try {
        result = await db.run('INSERT INTO messages (content, client_offset) VALUES (?, ?)', msg, clientOffset);
      } catch (e) {
        /* SQLITE_CONSTRAINT */
        if (e.errno === 19) {
          callback();
        } else {
          console.error('Erro ao salvar mensagem:', e);
        }
        return;
      }
      io.emit('chat message', msg, result.lastID);
      callback();
    });

    socket.on('disconnect', () => {
      console.log('Usuário desconectado:', socket.id);
    });

    if (!socket.recovered) {
      try {
        await db.each('SELECT id, content FROM messages WHERE id > ?',
          [socket.handshake.auth.serverOffset || 0],
          (_err, row) => {
            socket.emit('chat message', row.content, row.id);
          }
        )
      } catch (e) {
        console.error('Erro ao recuperar mensagens:', e);
      }
    }
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
}