# Pack · Reels Imperio IA · Publicidi Ads

**Para la comunidad Imperio IA** (skool.com/imperio-ia-5962) · estudio **Publicidi Ads** (publicidads.com.co).
Motor de animación y edición: kit de **Viegas Estudio** (ver `CREDITOS.md`).

Claude: la persona (un miembro de la comunidad) te ha pasado este pack. **Hazlo todo tú**, paso a paso, hablando claro y sin pedirle que escriba comandos. Pide permiso antes de instalar programas. Si algo falla, explícaselo en sencillo y propón la salida.

## 1. Instalar las skills
Copia cada carpeta de `skills/` (`editar-reels-claude`, `reels-imperio-ia`, `revisar-en-invideo`) a la carpeta de skills de usuario:
- Claude Code: `~/.claude/skills/` (en Windows `C:\Users\<usuario>\.claude\skills\`)
- Codex: `~/.codex/skills/`

Cada skill debe quedar con su `SKILL.md` directamente dentro. Si ya existía, reemplázala.

## 2. Preparar el equipo
Con la skill `reels-imperio-ia`, comprueba Node.js, ffmpeg, Python, Playwright con Chrome y GPU. Instala lo que falte **pidiendo permiso** (`python <skill>/scripts/preparar.py --json`, y con el sí `--instalar --prueba`).

## 3. Conectar invideo Editor (opcional, para revisar cómodo)
Comprueba si tienes herramientas de invideo. Si no:
- En la app de Claude: Ajustes > Conectores > invideo > Conectar; luego en el chat, + > Conectores > activar invideo Editor.
- En Claude Code (terminal) o Codex: que la persona abra **https://invideo.io** , entre en *remote-agents*, elija Claude Code, copie el prompt de configuración y te lo pegue.

Conectar es gratis; los agentes de invideo solo gastan créditos si generan algo. *(Si Imperio IA / Publicidi Ads tiene su propio enlace de invitación de invideo, cámbialo aquí.)*

## 4. La marca ya viene puesta
Los reels salen con la marca de la comunidad **sin tocar nada**: noche `#05070D` y rosa de alta conversión `#CC3366` (el look de publicidads.com.co), títulos en Space Grotesk.
- Otra paleta sin tocar el HTML: `--tema publicidi-ads` (rosa, por defecto), `--tema imperio-oro` (dorado premium) o los genéricos `claro|neon|lujo|pastel|noche-azul`.
- Para afinar la marca: cambia los tokens de `skills/reels-imperio-ia/motor/estilo.css` y `plantillas/estilo.json`. Pon el logo real de la persona (o de Imperio IA / Publicidi Ads) donde la plantilla pida `logo`.

## 5. Al terminar
Dile que reinicie Claude Code para cargar las skills y resume en 3 líneas cómo empezar:
1. Mete tu vídeo a cámara (o tu idea) en una carpeta y abre Claude Code ahí.
2. Pide: «Edita mi vídeo con `editar-reels-claude` y `reels-imperio-ia`, con la marca de la comunidad, hazme tres versiones».
3. Pide: «Súbelas a invideo Editor con `revisar-en-invideo` para compararlas», y corrige diciendo versión + segundo + qué cambiar.

Para ideas listas de la comunidad (intro, «únete a Imperio IA», promo de anuncios con IA, oferta, testimonio…), mira `COMUNIDAD.md`.
