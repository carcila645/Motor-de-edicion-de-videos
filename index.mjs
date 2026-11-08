#!/usr/bin/env node
/**
 * Reels Imperio IA · Publicidi Ads — servidor MCP propio.
 * Mismo patrón que el MCP de invideo (MCP remoto por URL / local por stdio), pero con tu marca
 * y tu motor (pack de reels en ../pack). Motor de animación: kit de Viegas Estudio (ver CREDITOS.md).
 *
 * Arranque:
 *   node index.mjs            → transporte stdio (para `claude mcp add` local)
 *   MODO=http node index.mjs  → transporte HTTP (para alojarlo y dar una URL a tu comunidad)
 *
 * Variables de entorno:
 *   PACK_DIR   ruta a la skill del motor (por defecto ../pack/skills/reels-imperio-ia)
 *   TRABAJO    carpeta donde se crean los proyectos y salen los MP4 (por defecto ./trabajo)
 *   PORT       puerto en modo http (por defecto 8787)
 *   PUBLIC_URL si sirves los MP4 por web, su base (p. ej. https://cdn.tudominio.com). Opcional.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const pexec = promisify(execFile);
const AQUI = path.dirname(fileURLToPath(import.meta.url));

const PACK_DIR = process.env.PACK_DIR
  ? path.resolve(process.env.PACK_DIR)
  : path.resolve(AQUI, '..', 'pack', 'skills', 'reels-imperio-ia');
const TRABAJO = process.env.TRABAJO ? path.resolve(process.env.TRABAJO) : path.resolve(AQUI, 'trabajo');
const PY = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');

const FORMATOS = { '9x16': [1080, 1920], '16x9': [1920, 1080], '1x1': [1080, 1080], '4x5': [1080, 1350] };

function texto(obj) { return { content: [{ type: 'text', text: typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2) }] }; }
function error(msg) { return { content: [{ type: 'text', text: msg }], isError: true }; }

function leerJSON(p) { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; } }

function catalogoPlantillas() {
  const out = { nichos: [], lanzamiento: [], ejemplos: [] };
  const nichos = leerJSON(path.join(PACK_DIR, 'plantillas', 'nichos', 'nichos.json'));
  const lanz = leerJSON(path.join(PACK_DIR, 'plantillas', 'lanzamiento', 'lanzamiento.json'));
  const norm = (d) => (Array.isArray(d) ? d : d ? (d.plantillas || d.nichos || Object.values(d)[0] || []) : []);
  for (const it of norm(nichos)) if (it && it.id) out.nichos.push({ id: it.id, sector: it.sector || '', que: (it.descripcion || it.que || '').slice(0, 120) });
  for (const it of norm(lanz)) if (it && it.id) out.lanzamiento.push({ id: it.id, que: (it.descripcion || it.que || '').slice(0, 120) });
  const ejDir = path.join(PACK_DIR, 'ejemplos', 'escenas');
  if (fs.existsSync(ejDir)) out.ejemplos = fs.readdirSync(ejDir).filter((f) => f.endsWith('.html')).map((f) => f.replace('.html', ''));
  return out;
}

function inyectarParams(sceneFile, params) {
  if (!params || typeof params !== 'object' || !Object.keys(params).length) return false;
  if (!fs.existsSync(sceneFile)) return false;
  let html = fs.readFileSync(sceneFile, 'utf8');
  const re = /(<script\s+id=["']params["'][^>]*>)([\s\S]*?)(<\/script>)/i;
  if (!re.test(html)) return false;
  html = html.replace(re, (_m, a, _b, c) => `${a}\n${JSON.stringify(params, null, 2)}\n${c}`);
  fs.writeFileSync(sceneFile, html);
  return true;
}

async function estadoEquipo() {
  const script = path.join(PACK_DIR, 'scripts', 'preparar.py');
  if (!fs.existsSync(script)) return { ok: false, motivo: `No encuentro el motor en ${PACK_DIR}. Pon PACK_DIR a la carpeta de la skill reels-imperio-ia.` };
  try {
    const { stdout } = await pexec(PY, ['-I', script, '--json'], { cwd: PACK_DIR, timeout: 120000, maxBuffer: 1 << 20 });
    const j = leerJSON(stdout.trim()) || JSON.parse(stdout.slice(stdout.indexOf('{')));
    return { ok: true, equipo: j };
  } catch (e) {
    return { ok: false, motivo: `No pude comprobar el equipo (¿falta Python?). Detalle: ${e.message}` };
  }
}

const server = new McpServer({ name: 'reels-imperio-ia', version: '1.0.0' });

server.registerTool(
  'listar_plantillas',
  {
    title: 'Listar plantillas',
    description: 'Devuelve el catálogo de plantillas del pack (nichos, lanzamiento y ejemplos 3D) con su id, para usarlas en crear_reel.',
    inputSchema: {},
  },
  async () => texto(catalogoPlantillas()),
);

server.registerTool(
  'estado_equipo',
  {
    title: 'Estado del equipo',
    description: 'Comprueba si el equipo tiene lo necesario para renderizar (Node, ffmpeg, Python, Playwright/Chrome). Úsalo si crear_reel falla.',
    inputSchema: {},
  },
  async () => texto(await estadoEquipo()),
);

server.registerTool(
  'crear_reel',
  {
    title: 'Crear reel',
    description:
      'Crea un reel con el motor de la marca y entrega un MP4. Parte de una plantilla del catálogo (usa listar_plantillas), le mete tus textos (params), aplica el tema de marca y renderiza.',
    inputSchema: {
      plantilla: z.string().describe('id de una plantilla (p. ej. gen-intro-logo, edu-lanzamiento, 3d-telefono). Ver listar_plantillas.'),
      params: z.record(z.any()).optional().describe('textos y valores de la plantilla (objeto). Se inyectan en su bloque <script id="params">.'),
      tema: z.enum(['publicidi-ads', 'imperio-oro', 'noche-azul', 'claro', 'neon', 'lujo', 'pastel']).default('publicidi-ads').describe('paleta de marca.'),
      formato: z.enum(['9x16', '16x9', '1x1', '4x5']).default('9x16').describe('formato del lienzo.'),
      calidad: z.enum(['previa', 'hd', 'final']).default('previa').describe('previa=1080p30 rápido · hd=1080p60 · final=4K60.'),
      nombre: z.string().optional().describe('nombre de carpeta del proyecto (por defecto, la plantilla + fecha).'),
    },
  },
  async ({ plantilla, params, tema, formato, calidad, nombre }) => {
    const nuevo = path.join(PACK_DIR, 'scripts', 'nuevo.py');
    const render = path.join(PACK_DIR, 'scripts', 'render.mjs');
    if (!fs.existsSync(nuevo) || !fs.existsSync(render)) return error(`No encuentro el motor en ${PACK_DIR}. Ajusta PACK_DIR.`);
    const [ancho, alto] = FORMATOS[formato] || FORMATOS['9x16'];
    const slug = (nombre || `${plantilla}-${new Date().toISOString().slice(0, 10)}`).replace(/[^a-z0-9\-_]/gi, '-');
    const proj = path.join(TRABAJO, slug);
    fs.mkdirSync(TRABAJO, { recursive: true });
    // 1) crear proyecto
    try {
      await pexec(PY, ['-I', nuevo, proj, '--plantilla', plantilla, '--ancho', String(ancho), '--alto', String(alto)], { cwd: PACK_DIR, timeout: 120000, maxBuffer: 1 << 20 });
    } catch (e) {
      return error(`No pude crear el proyecto con la plantilla «${plantilla}». ¿Existe en el catálogo? Detalle: ${e.message}`);
    }
    // 2) inyectar params
    const escena = path.join(proj, 'escenas', `${plantilla}.html`);
    const inyectado = inyectarParams(escena, params);
    // 3) renderizar
    try {
      const { stdout, stderr } = await pexec('node', [path.join(proj, 'scripts', 'render.mjs'), 'video', plantilla, '--calidad', calidad, '--tema', tema], { cwd: proj, timeout: 1000 * 60 * 20, maxBuffer: 8 << 20 });
      const resDir = path.join(proj, 'resultados');
      const mp4s = fs.existsSync(resDir) ? fs.readdirSync(resDir).filter((f) => f.endsWith('.mp4')).map((f) => path.join(resDir, f)) : [];
      const salida = mp4s.map((p) => ({ archivo: p, mb: +(fs.statSync(p).size / 1048576).toFixed(2), url: process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL.replace(/\/$/, '')}/${slug}/${path.basename(p)}` : null }));
      return texto({ ok: true, plantilla, tema, formato, calidad, params_inyectados: inyectado, proyecto: proj, reels: salida, log: (stderr || stdout || '').slice(-400) });
    } catch (e) {
      const estado = await estadoEquipo();
      return error(`No pude renderizar. Suele ser que falta preparar el equipo (Chrome/ffmpeg).\nEstado: ${JSON.stringify(estado.equipo || estado.motivo)}\nDetalle: ${e.message.slice(0, 400)}`);
    }
  },
);

async function main() {
  const modo = (process.env.MODO || 'stdio').toLowerCase();
  if (modo === 'http') {
    const { StreamableHTTPServerTransport } = await import('@modelcontextprotocol/sdk/server/streamableHttp.js');
    const http = await import('node:http');
    const PORT = +(process.env.PORT || 8787);
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    await server.connect(transport);
    http
      .createServer((req, res) => {
        if (req.url !== '/mcp') { res.writeHead(404).end('usa /mcp'); return; }
        let body = '';
        req.on('data', (c) => (body += c));
        req.on('end', () => transport.handleRequest(req, res, body ? JSON.parse(body) : undefined));
      })
      .listen(PORT, () => console.error(`[reels-imperio-ia] MCP HTTP en http://localhost:${PORT}/mcp`));
  } else {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('[reels-imperio-ia] MCP por stdio listo.');
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
