@echo off
setlocal EnableExtensions
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo =====================================================
echo   Subir cambios al portafolio publicado
echo =====================================================
echo.

REM Pedir mensaje
set /p MSG=Describe el cambio (o Enter para usar uno por defecto):
if "%MSG%"=="" set MSG=Actualizar portafolio

echo.
echo [..] Agregando archivos...
git add .

echo [..] Creando commit: "%MSG%"
git commit -m "%MSG%"
if errorlevel 1 (
    echo.
    echo [!] No habia cambios para commitear o algo fallo.
    pause & exit /b 1
)

echo [..] Subiendo a GitHub...
git push
if errorlevel 1 (
    echo [X] Fallo el push. Revisa la conexion o las credenciales.
    pause & exit /b 1
)

echo.
echo =====================================================
echo   LISTO! Cambios subidos.
echo =====================================================
echo.
echo En menos de 1 minuto se veran en:
echo   https://mayerliarrigui.github.io/proyecto_portafolio_alejandra/
echo.
pause
endlocal
