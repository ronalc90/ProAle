@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul

echo.
echo =====================================================
echo   LIMPIEZA TOTAL DE CREDENCIALES DE GITHUB / GIT
echo =====================================================
echo.

REM ---------- 1. Borrar credenciales de Windows Credential Manager ----------
echo [1/5] Borrando credenciales de Windows Credential Manager...
for /f "tokens=1,2 delims= " %%a in ('cmdkey /list ^| findstr /i "Target"') do (
    set "T=%%b"
    echo !T! | findstr /i "github" >nul && (
        echo       eliminando: !T!
        cmdkey /delete:!T! >nul 2>nul
    )
    echo !T! | findstr /i "git:" >nul && (
        echo       eliminando: !T!
        cmdkey /delete:!T! >nul 2>nul
    )
)
echo       OK

REM ---------- 2. Pedir a GCM que olvide github.com ----------
echo [2/5] Pidiendole a Git Credential Manager que olvide github.com...
( echo protocol=https
  echo host=github.com
  echo. ) | git credential reject 2>nul
( echo protocol=https
  echo host=github.com
  echo. ) | git credential-manager erase 2>nul
( echo protocol=https
  echo host=github.com
  echo. ) | git credential-manager-core erase 2>nul
echo       OK

REM ---------- 3. Borrar carpetas de cache de GCM ----------
echo [3/5] Borrando carpetas cache de GCM...
if exist "%LOCALAPPDATA%\GitCredentialManager" (
    rmdir /s /q "%LOCALAPPDATA%\GitCredentialManager" 2>nul
    echo       borrado: %LOCALAPPDATA%\GitCredentialManager
)
if exist "%LOCALAPPDATA%\Git Credential Manager" (
    rmdir /s /q "%LOCALAPPDATA%\Git Credential Manager" 2>nul
    echo       borrado: %LOCALAPPDATA%\Git Credential Manager
)
if exist "%LOCALAPPDATA%\.IdentityService" (
    rmdir /s /q "%LOCALAPPDATA%\.IdentityService" 2>nul
    echo       borrado: %LOCALAPPDATA%\.IdentityService
)
echo       OK

REM ---------- 4. Borrar archivos de credenciales de git ----------
echo [4/5] Borrando archivos de credenciales de Git...
if exist "%USERPROFILE%\.git-credentials" (
    del /f /q "%USERPROFILE%\.git-credentials" 2>nul
    echo       borrado: %USERPROFILE%\.git-credentials
)
if exist "%USERPROFILE%\.gitconfig.lock" (
    del /f /q "%USERPROFILE%\.gitconfig.lock" 2>nul
)
echo       OK

REM ---------- 5. Configurar GCM para que siempre abra navegador ----------
echo [5/5] Configurando Git para que SIEMPRE abra el navegador al login...
git config --global --unset-all credential.helper 2>nul
git config --global credential.helper manager
git config --global credential.https://github.com.provider github
git config --global credential.https://github.com.useHttpPath true
git config --global credential.guiPrompt true
REM Forzar el flujo OAuth en el navegador (no device code)
git config --global credential.gitHubAuthModes "browser"
git config --global credential.azureReposCredentialType oauth
echo       OK

echo.
echo =====================================================
echo   LIMPIEZA COMPLETA
echo =====================================================
echo.
echo La proxima vez que pushees, se abrira el navegador
echo y podras elegir con que cuenta de Google/GitHub
echo iniciar sesion.
echo.
echo TIP: Si quieres usar otra cuenta de Google, abre tu
echo navegador y entra a https://github.com/logout PRIMERO
echo (o usa una ventana de incognito al hacer el login).
echo.
pause
endlocal
