const express = require("express");
const next = require("next");
const path = require("path");

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";

// FRONT: /web
const app = next({ dev, dir: path.join(__dirname, "web") });
const handle = app.getRequestHandler();

// BACK: /api/src/app.ts
require("ts-node/register/transpile-only");
const { createApp } = require("./api/src/app");

app.prepare().then(() => {
  const server = express();
  server.use("/api", createApp());
  server.all("*", (req, res) => handle(req, res));
  server.listen(port, () => console.log(`✅ Ready on port ${port}`));
});