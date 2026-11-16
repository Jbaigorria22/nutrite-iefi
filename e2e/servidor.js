// Servidor estático mínimo para los tests E2E (sin dependencias).
// Sirve los archivos del sitio en http://localhost:4173, igual que Live Server.

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const PUERTO = 4173;
const RAIZ = process.cwd();
const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
};

createServer(async (pedido, respuesta) => {
  const ruta = decodeURIComponent(new URL(pedido.url, "http://x").pathname);
  const archivo = join(RAIZ, normalize(ruta === "/" ? "/index.html" : ruta));

  // Evita salir de la carpeta del proyecto (../)
  if (!archivo.startsWith(RAIZ)) {
    respuesta.writeHead(403).end();
    return;
  }

  try {
    const contenido = await readFile(archivo);
    respuesta.writeHead(200, { "Content-Type": TIPOS[extname(archivo)] || "application/octet-stream" });
    respuesta.end(contenido);
  } catch {
    respuesta.writeHead(404).end("No encontrado");
  }
}).listen(PUERTO, () => console.log(`Sitio en http://localhost:${PUERTO}`));
