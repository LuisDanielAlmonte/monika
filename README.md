# Cómo los miedos afectan la conducta individual y grupal

Presentación animada para la clase de Psicología.
**Participantes:** Altagracia Castillo · Ambar Casals · Monika Puente

La historia visual va de la duda a la confianza. Empieza en tonos oscuros con niebla, se abre una puerta de luz en *«¿Podemos aprender a afrontar nuestros miedos?»* y termina en colores claros. El mismo personaje aparece al principio con las manos en la cabeza y al final con los brazos abiertos.

## Cómo abrirla

| Opción | Para qué |
|---|---|
| **`presentacion-offline.html`** | Un solo archivo con todo incluido (fuentes, foto, animaciones). Se abre con doble clic, **sin internet**. Ideal para la computadora del aula o una USB. |
| **`index.html`** | Versión en carpetas (la que se publica en GitHub Pages). |
| **GitHub Pages** | Con Pages activado sobre `main`, queda en `https://luisdanielalmonte.github.io/monika/`. |

## Controles

| Acción | Teclado | Mouse / táctil |
|---|---|---|
| Siguiente / anterior | `→` `←` · `Espacio` · `PageDown` / `PageUp` (sirve con presentadores inalámbricos) | Clic a la derecha / izquierda · deslizar |
| Pantalla completa | `F` | Botón en la barra inferior |
| Vista general de todas las diapositivas | `O` o `Esc` | Botón **Diapositivas** |
| Ir a la diapositiva 1–9 | `1` … `9` | Puntos de la barra |
| Primera / última | `Inicio` / `Fin` | |

La barra inferior está oculta mientras presentas. Aparece al bajar el mouse al borde inferior. El cursor se esconde solo si no se mueve.

**Exportar a PDF:** abrir en Chrome → `Ctrl + P` → *Guardar como PDF*, con **Gráficos de fondo** activado. Sale una diapositiva por página.

## Estructura

```
index.html                  Contenido de las 15 diapositivas
assets/css/deck.css         Estilos, paleta, animaciones, vista general e impresión
assets/js/deck.js           Navegación, transiciones, barra, pantalla completa
assets/fonts/               Lora (títulos) e Inter (texto), incluidas para uso sin internet
assets/img/                 Fotografías
tools/build_standalone.py   Genera presentacion-offline.html
```

### Agregar fotos

1. Subir la foto a `assets/img/` (en GitHub: *Add file → Upload files*).
2. Usarla en `index.html` igual que `assets/img/ansiedad.jpg` en la diapositiva 2.
3. Regenerar el archivo offline: `python3 tools/build_standalone.py`.

### Cambiar textos

Cada diapositiva es un `<section class="slide">` en `index.html`, con un comentario que la identifica (`<!-- 6 · FRACASO Y RECHAZO -->`). Después de editar, regenerar `presentacion-offline.html`.

## Fuentes y créditos

- Tipografías **Lora** e **Inter**, licencia SIL Open Font License.
- Ilustraciones e íconos dibujados en SVG para esta presentación.
- Referencias citadas: Pittig et al. (2020); LeDoux y Daw (2018); Janis (1972); Tedeschi et al. (2021); Bandura (autoeficacia).
