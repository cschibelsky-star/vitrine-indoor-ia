@echo off
setlocal
cd /d "%~dp0"
echo ======================================================
echo Iniciando Servidor do Vitrine Indoor IA...
echo ======================================================
start "" http://localhost:8080/
if exist scripts\server.cjs (
  node scripts\server.cjs
) else if exist scripts\serve.py (
  python scripts\serve.py
) else (
  echo Erro: scripts de servidor não encontrados.
  pause
)
endlocal
