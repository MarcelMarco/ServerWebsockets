import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import config from "config";
import logger from "./utils/logger";
import { version } from "../package.json";

import socket from "./socket";

const port = config.get<number>("port");
const host = config.get<string>("host");
const corsOrigin = "*"

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
    credentials: true,
  },
});

app.get("/", (_, res) =>
  res.send(`Server is up and running version ${version}`)
);

httpServer.listen(port, host, () => {
  logger.info(`🚀 Server version ${version} is listening 🚀`);
  logger.info(`http://${host}:${port}`);

  socket({ io });
});

//-------------------------------------------------------------

// import express from "express";
// import { createServer } from "http";
// import { Server } from "socket.io";
// import config from "config";
// import logger from "./utils/logger";
// import { version } from "../package.json";
// import socket from "./socket";
// import axios from "axios";
// import { Challenge } from "./model/Challenge";

// const port = config.get<number>("port");
// const host = config.get<string>("host");
// const corsOrigin = "*"

// const app = express();

// const httpServer = createServer(app);

// const io = new Server(httpServer, {
//   cors: {
//     origin: corsOrigin,
//     credentials: true,
//   },
// });

// app.get("/", (_, res) =>
//   res.send(`Server is up and running version ${version}`)
// );

// httpServer.listen(port, host, async () => {
//   logger.info(`🚀 Server version ${version} is listening 🚀`);
//   logger.info(`http://${host}:${port}`);

//   try {
//     const response = await axios.get("http://localhost:3002/challenge/get/all", {
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiI2NDU4ZTBhZDgyZmMwNmI3OTA0NDBhOTYiLCJuYW1lIjoiZyIsInN1cm5hbWUiOiJnIiwidXNlcm5hbWUiOiJnIiwicm9sZSI6InVzZXIiLCJpYXQiOjE2ODU2OTEzNjQsImV4cCI6MTY4NTY5ODU2NH0.FSwOG6E7VVL1vQUyGIve9mXSJApTjM5hnsnNaXFuNAw",
//       },
//     });

//     const challengeList = response.data as Challenge[];

//     socket({ io, challengeList });
//   } catch (error) {
//     logger.error("Error fetching challenges:", error);
//   }
// });

