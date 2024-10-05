@echo off
setlocal

echo Install Python Modules...
set VENV_PATH=.\venv\Scripts\activate
if exist requirements.txt (
    call %VENV_PATH%
    pip install -r requirements.txt
    deactivate

    IF ERRORLEVEL 1 (
        echo Some errors occured: Install Python Modules
    ) ELSE (
        echo Success
 
        echo Install Node.js Packages...
        npm install

        IF ERRORLEVEL 1 (
            echo Some errors occured: Install Node.js Packages
        ) ELSE (
            echo Success
        )
    )
) ELSE (
    echo requirements.txt is not found.
    exit /b 1
)
