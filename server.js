const express = require("express");
const next = require("next");
const path = require("path");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;

/**
 * FRONTEND → carpeta /web (Next App Router dentro de /web/src/app)
 */
const app = next({ dev, dir: path.join(__dirname, "web") });
const handle = app.getRequestHandler();

/**
 * BACKEND → tu Express exporta createApp() en api/src/app.ts
 * Intentamos cargar compilado (api/dist/app.js); si no existe, usamos ts-node en runtime.
 */
let createApp;
try {
  createApp = require("./api/dist/app").createApp; // tras compilar TS
} catch {
  require("ts-node/register");                     // fallback en runtime
  createApp = require("./api/src/app").createApp;  // TS sin compilar
}

app.prepare().then(() => {
  const server = express();

  // Monta tu API en /api/*
  server.use("/api", createApp());

  // Resto: Next
  server.all("*", (req, res) => handle(req, res));

  server.listen(port, () => {
    console.log(`✅ Server ready on http://localhost:${port}`);
  });
});