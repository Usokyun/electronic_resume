@echo off
echo Starting local server at http://localhost:8080
echo.
echo API requests will be proxied to OpenRouter.
echo.
cd /d "%~dp0agent"
node server.js
