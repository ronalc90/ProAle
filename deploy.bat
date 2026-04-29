@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo =====================================================
echo   Despliegue del portafolio a GitHub
echo   Repo: mayerliarrigui/proyecto_portafolio_alejandra
echo =====================================================
echo.

REM ---------- 0. Verificar git ----------
where git >nul 2>nul
if errorlevel 1 (
    echo [X] Git no esta instalado. Descargalo en: https://git-scm.com/download/win
    pause & exit /b 1
)
for /f "tokens=*" %%v in ('git --version') do echo [OK] %%v
echo.

REM ============================================================
REM   PASO 1 - LIMPIEZA TOTAL
REM ============================================================
echo [1/8] Limpiando TODAS las credenciales de Git/GitHub...

REM Windows Credential Manager
for /f "tokens=1,2 delims= " %%a in ('cmdkey /list ^| findstr /i "Target"') do (
    set "T=%%b"
    echo !T! | findstr /i "github" >nul && cmdkey /delete:!T! >nul 2>nul
    echo !T! | findstr /i "git:" >nul && cmdkey /delete:!T! >nul 2>nul
)

REM Decirle a GCM que olvide github.com
( echo protocol=https
  echo host=github.com
  echo. ) | git credential reject 2>nul
( echo protocol=https
  echo host=github.com
  echo. ) | git credential-manager erase 2>nul
( echo protocol=https
  echo host=github.com
  echo. ) | git credential-manager-core erase 2>nul

REM Borrar caches
if exist "%LOCALAPPDATA%\GitCredentialManager"     rmdir /s /q "%LOCALAPPDATA%\GitCredentialManager" 2>nul
if exist "%LOCALAPPDATA%\Git Credential Manager"   rmdir /s /q "%LOCALAPPDATA%\Git Credential Manager" 2>nul
if exist "%LOCALAPPDATA%\.IdentityService"         rmdir /s /q "%LOCALAPPDATA%\.IdentityService" 2>nul
if exist "%USERPROFILE%\.git-credentials"          del /f /q "%USERPROFILE%\.git-credentials" 2>nul

REM Forzar GCM en modo navegador
git config --global --unset-all credential.helper 2>nul
git config --global credential.helper manager
git config --global credential.https://github.com.provider github
git config --global credential.https://github.com.useHttpPath true
git config --global credential.guiPrompt true
git config --global credential.gitHubAuthModes "browser"
echo [OK] Limpieza completa.
echo.

REM ============================================================
REM   PASO 2 - CERRAR SESION ACTUAL EN GITHUB
REM ============================================================
echo [2/8] Cerrando tu sesion actual en GitHub.com...
echo       (esto evita que el push use otra cuenta sin querer)
echo.
start "" "https://github.com/logout"
timeout /t 2 /nobreak >nul
echo Cuando aparezca "Sign out" en el navegador, dale click.
echo.
echo Presiona una tecla cuando hayas cerrado sesion...
pause >nul

REM ============================================================
REM   PASO 3 - LOGIN EN GITHUB CON LA CUENTA QUE QUIERAS
REM ============================================================
echo.
echo [3/8] Abriendo GitHub para que inicies sesion...
echo.
echo *** IMPORTANTE ***
echo - Si tu cuenta de GitHub usa un email de Gmail/Google,
echo   inicia sesion en el navegador como siempre.
echo   Tu navegador (Chrome/Edge) recordara tu cuenta de Google
echo   y autocompletara el email.
echo - Inicia sesion con la cuenta: mayerliarrigui
echo   (o la cuenta que tenga acceso al repo).
echo.
start "" "https://github.com/login?return_to=https://github.com/mayerliarrigui/proyecto_portafolio_alejandra"
timeout /t 2 /nobreak >nul
echo.
echo CUANDO YA ESTES DENTRO de GitHub.com con la cuenta correcta,
echo presiona una tecla aqui para continuar con el push...
pause >nul

REM ============================================================
REM   PASO 4 - Configurar autor del commit
REM ============================================================
echo.
echo [4/8] Configurando autor del commit...
for /f "tokens=*" %%n in ('git config --global user.name 2^>nul') do set GITNAME=%%n
for /f "tokens=*" %%e in ('git config --global user.email 2^>nul') do set GITMAIL=%%e
if not defined GITNAME git config --global user.name "Laura Cortes"
if not defined GITMAIL git config --global user.email "lauraalejandracortesortegate@gmail.com"
echo [OK]
echo.

REM ============================================================
REM   PASO 5 - Limpiar .git previo
REM ============================================================
echo [5/8] Limpiando .git previo (si existe)...
if exist .git (
    attrib -h -r -s .git /s /d >nul 2>nul
    rmdir /s /q .git
    if exist .git (
        echo [X] No pude borrar .git. Borralo a mano y reintenta.
        pause & exit /b 1
    )
)
echo [OK]
echo.

REM ============================================================
REM   PASO 6 - Init + commit
REM ============================================================
echo [6/8] Inicializando repo y haciendo commit...
git init -b main >nul 2>nul
if errorlevel 1 (
    git init >nul
    git checkout -b main >nul 2>nul
)
git add .
git commit -m "Initial commit: portafolio Laura Cortes" >nul
if errorlevel 1 (
    echo [X] Error al crear el commit.
    pause & exit /b 1
)
echo [OK]
echo.

REM ============================================================
REM   PASO 7 - Configurar remoto
REM ============================================================
echo [7/8] Configurando remoto origin...
git remote remove origin >nul 2>nul
git remote add origin https://github.com/mayerliarrigui/proyecto_portafolio_alejandra.git
git branch -M main >nul 2>nul
echo [OK]
echo.

REM ============================================================
REM   PASO 8 - PUSH
REM ============================================================
echo [8/8] Subiendo a GitHub...
echo.
echo *** Si aparece una ventana del navegador pidiendo autorizar
echo *** "Git Credential Manager", dale ACEPTAR.
echo.
git push -u origin main --force
if errorlevel 1 (
    echo.
    echo =====================================================
    echo [X] FALLO el push.
    echo =====================================================
    echo.
    echo La cuenta que usaste no tiene permisos en
    echo mayerliarrigui/proyecto_portafolio_alejandra
    echo.
    echo Soluciones:
    echo   1) Pide a mayerliarrigui que te agregue como colaborador:
    echo      https://github.com/mayerliarrigui/proyecto_portafolio_alejandra/settings/access
    echo   2) O sube el portafolio a TU PROPIA cuenta de GitHub
    echo      (avisame y te genero un script nuevo).
    echo.
    pause & exit /b 1
)

echo.
echo =====================================================
echo   LISTO! Portafolio publicado en GitHub
echo =====================================================
echo.
echo Repo: https://github.com/mayerliarrigui/proyecto_portafolio_alejandra
echo.
echo Activando GitHub Pages automaticamente...
echo.
echo PROXIMO PASO:
echo   1. En la pagina que se abrira, en Source:
echo      Deploy from a branch
echo   2. Branch: main / (root)  ^>  Save
echo   3. Espera ~1 min y abre:
echo      https://mayerliarrigui.github.io/proyecto_portafolio_alejandra/
echo.

start "" "https://github.com/mayerliarrigui/proyecto_portafolio_alejandra/settings/pages"

pause
endlocal
