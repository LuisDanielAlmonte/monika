#!/usr/bin/env python3
"""Genera presentacion-offline.html: un solo archivo con estilos, script,
fuentes e imágenes incrustados. Sirve para abrir la presentación sin internet
o enviarla por correo / USB.

Uso:  python3 tools/build_standalone.py
"""
import base64, mimetypes, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "presentacion-offline.html"


def data_uri(path: Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    if path.suffix == ".woff":
        mime = "font/woff"
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()


def main() -> None:
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    css_path = ROOT / "assets/css/deck.css"
    css = css_path.read_text(encoding="utf-8")
    css = re.sub(r"url\((\.\./[^)]+)\)", lambda m: f"url({data_uri((css_path.parent / m.group(1)).resolve())})", css)
    js = (ROOT / "assets/js/deck.js").read_text(encoding="utf-8")

    html = re.sub(r'<link rel="preload"[^>]*>\n', "", html)
    html = html.replace('<link rel="stylesheet" href="assets/css/deck.css">', f"<style>\n{css}</style>")
    html = html.replace('<script src="assets/js/deck.js"></script>', f"<script>\n{js}</script>")
    html = re.sub(r'(src|href)="(assets/img/[^"]+)"', lambda m: f'{m.group(1)}="{data_uri(ROOT / m.group(2))}"', html)

    OUT.write_text(html, encoding="utf-8")
    print(f"OK → {OUT.name} ({OUT.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
