# mcp-server — Reels Imperio IA · Publicidi Ads

Servidor MCP que envuelve el motor de reels del pack. Mismo patrón que el MCP de invideo, con tu marca.

## Herramientas
- **listar_plantillas** → `{ nichos[], lanzamiento[], ejemplos[] }` (id + descripción). Sin dependencias pesadas.
- **crear_reel** `{ plantilla, params?, tema?, formato?, calidad?, nombre? }` → crea el proyecto, inyecta `params` en el bloque `<script id="params">` de la escena, renderiza y devuelve el/los MP4.
- **estado_equipo** → comprueba Node / ffmpeg / Python / Chrome.

## Correr
```bash
npm install
node index.mjs            # stdio (local, para `claude mcp add`)
MODO=http node index.mjs  # HTTP en /mcp (para alojar y compartir una URL)
```

## Config (variables de entorno)
| Var | Por defecto | Para qué |
|---|---|---|
| `PACK_DIR` | `../pack/skills/reels-imperio-ia` | ruta al motor |
| `TRABAJO` | `./trabajo` | donde se crean proyectos y salen los MP4 |
| `PORT` | `8787` | puerto en modo http |
| `PUBLIC_URL` | — | base web para servir los MP4 (opcional) |
| `PYTHON` | `python3`/`python` | intérprete de Python |

## Notas
- `crear_reel` necesita el equipo preparado (Chrome + ffmpeg). Si falla, llama antes a `estado_equipo` o corre `scripts/preparar.py --instalar`.
- El render puede tardar (igual que cualquier generación de video). `calidad: previa` es rápida para iterar.
- El SDK usado es `@modelcontextprotocol/sdk`. Probado con Node 22.
