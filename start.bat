@echo off
setlocal
cd /d "%~dp0"
if exist dist\index.html goto serve
call npm ci
if errorlevel 1 goto failed
call npm run build
if errorlevel 1 goto failed
:serve
node scripts\server.cjs --open
if not errorlevel 1 exit /b 0
:failed
echo Falha ao iniciar o player. Veja a mensagem acima.
pause
exit /b 1
