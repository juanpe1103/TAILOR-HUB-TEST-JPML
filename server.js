import express from "express";
import next from "next";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// Necesario para rutas absolutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";

// FRONT: /web
const nextApp = next({ dev, dir: path.join(__dirname, "web") });
const handle = nextApp.getRequestHandler();

// BACK: usamos el JS compilado (no TS)
const { createApp } = require("./api/dist/app.js");

nextApp.prepare().then(() => {
  const server = express();
  server.use("/api", createApp());
  server.all("*", (req, res) => handle(req, res));
  server.listen(port, () => console.log(`✅ Ready on port ${port}`));
});