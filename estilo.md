# Guía de estilo de los reels (Imperio IA · Publicidi Ads)

Método de animación de Viegas Estudio (ver CREDITOS.md), afinado nota a nota. Aquí va con la marca de la comunidad:
noche #05070D y rosa de alta conversión #CC3366. Para otra marca se cambian los colores y las fuentes
(`estilo.css`, `estilo.json`): **los principios no se cambian**.

## 1. Principios
1. **Sincronía con la voz:** cada elemento entra en la palabra que lo nombra, con 0,1–0,3 s de adelanto.
2. **Jerarquía y escalonado:** primero lo grande y luego el detalle (título → contenedor → icono → texto → detalle), con 0,05–0,3 s entre hermanos.
3. **Rebote natural** en todo lo que entra (`rebote`); `reboteSuave` para cámaras y recorridos.
4. **Desenfoque de movimiento direccional**, σ = |v| / 160 (px/s), más 3–6 px de desenfoque base al llegar. La cámara, con solo el 45–60 % de esa cantidad, para que se lea. `MG.entra()` lo hace solo.
5. **La cámara nunca se para:** `MG.camara(t, 1.0, 1.08)` (o de 1.12 a 1.0) en toda la escena, más recorridos con `reboteSuave`.
6. **Profundidad:** 3D real (perspectiva 1800 px). Lo que está detrás: más pequeño, al 50 % de luz y con hasta 6 px de desenfoque.
7. **Nada aparece de golpe y nada se cruza.** Un logo que sube no pasa por encima de las tarjetas que entran: o entra antes, o va por delante en z.
8. **Lo animado se enseña animado:** si se habla de vídeos, carruseles o pantallas, las tarjetas llevan vídeo (`MG.tarjeta`), nunca JPG.
9. **Zonas libres:** con subtítulos, los 180 px de abajo; con el botón de suscribirse, el centro de abajo.

## 2. Paleta y tipografía (marca Imperio IA · Publicidi Ads)
| Uso | Valor |
|---|---|
| Fondo | `#05070D` con rejilla de 70 px (140 px en 4K) `#121A2B` y halo rosa desde abajo |
| Acento (pastillas, bordes activos) | `#CC3366` · claro para palabras clave `#FF5C8A` · apoyo azul `#2563EB` |
| Texto | `#EDF2F9` · secundario `#8A93A6` |
| Tarjetas | `#101828` / `#0C1424`, borde claro al 7–16 %, radio 16 px (64 en 4K) |
| Cristal (píldoras y nodos) | degradado rosa claro del 12 % al 4 %, borde al 20 %, sombra `0 18px 50px rgba(0,0,0,.45)` |
| Brillo de lo activo | sombra en el color de acento: distancia 0, suavizado 90–120, al 55–75 % |
| Fuente | Space Grotesk (Bold 700 en títulos; Semibold en el resto) · código: Consolas / Geist Mono |

> Variante premium para aperturas de la comunidad: tema `imperio-oro` (dorado #E8B24A sobre la misma noche). El logo de Claude y la mascota se quedan en su coral #D97757 aunque cambie el acento.

## 3. Piezas y cuándo usarlas (con su ejemplo)
| Pieza | Ejemplo | Para |
|---|---|---|
| Logo con barrido de luz + arco 3D | `logo-arco-3d` | aperturas: marca y producto |
| Flujo de nodos con ✓ | `flujo-nodos` | «cómo funciona», procesos de 3–5 pasos |
| Filas que bajan | `lista-escalonada` | enumerar ventajas o características |
| Carrusel ovalado 3D | `carrusel-ovalado` | enseñar una galería o un carrusel |
| Rejilla con nombres | `rejilla-estilos` | catálogos, kits, planes |
| Proceso con cámara que recorre | `proceso-pasos` | explicar algo técnico paso a paso |
| Chat recreado | `chat-claude` | demos de IA, preguntas y respuestas |
| Interruptor A/B | `interruptor` | comparar dos modos u opciones |
| Cierre con título | `cierre-titulo` | final de intro, transición al contenido |
| 3D: logo, tarjetas, producto, gráfica | `logo-3d`, `tarjetas-3d`, `producto-3d`, `grafica-3d` | aperturas premium, presentaciones, datos |
| Pantalla en 3D (interfaz real con enfoque de cine) | `pantalla-3d` | enseñar una herramienta, el panel o una web; intros y ganchos |

## 4. Transición de salida a la cámara (si va dentro de un vídeo)
El logo (o la mascota) entra girando desde fuera con rebote. El fondo se desenfoca de 0 a 70, pero el texto queda nítido. El logo hace de mate: dentro de su forma aparece el vídeo, que entra con un zoom out de ×1,32 a ×1. Las escenas se renderizan con **0,5 s de cola** para cubrirla.
Se monta en el editor (Viegas Editor o After Effects), no en el HTML.
