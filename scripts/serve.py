#!/usr/bin/env python3
"""
Servidor HTTP simples em Python 3 com suporte básico para desenvolvimento local.
"""
import os
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = int(os.environ.get("PORT", 8080))
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

class CustomHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT_DIR, **kwargs)

def main():
    print("=======================================================")
    print(f"📺 Vitrine Indoor IA - Servidor Python")
    print(f"- Player:  http://localhost:{PORT}/")
    print(f"- Auditor: http://localhost:{PORT}/auditor/")
    print("=======================================================")
    server = HTTPServer(("0.0.0.0", PORT), CustomHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor encerrado.")

if __name__ == "__main__":
    main()
