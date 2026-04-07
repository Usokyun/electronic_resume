@echo off
echo Starting local server at http://localhost:8080
echo.
echo API requests will be proxied to MiniMax.
echo.
cd /d "%~dp0.."
npx serve -l 8080
