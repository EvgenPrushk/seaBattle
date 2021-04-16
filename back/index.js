// зависимости
const session = require("express-session");
const express = require("express");

// создания приложения ExpressJS
const app = express();
const http = require("http");
const server = http.createServer(app);

//Регистрация Socket приложения
const io = require("socket.io")(server);
const port = 3000;

//Настройка сессий
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "s3Cur3",
    name: "sessionId",
  })
);

// Настройка статики
app.use(express.static("./../front/"));

// Поднятие сервера
server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// Массив ожидающих игроков
// Используем коллекцию Set для добавления, удаления игроков
const waitingRandom = new Set();

// Прослушивание socket соединения
io.on("connection", (socket) => {
  io.emit("playerCount", io.engine.clientsCount);

  socket.on(
    "disconnect",
    () => io.emit("playerCount", io.engine.clientsCount)

    //   if (waitingRandom.has(socket)) {
    //     waitingRandom.delete(socket);
    //   }
  );

  socket.on("findRandomOpponent", () => {
    waitingRandom.add(socket);
    socket.emit("status", "randomFinding");
  });
});
