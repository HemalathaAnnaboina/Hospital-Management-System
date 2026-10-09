@echo off
title Hospital Backend (Spring Boot)
echo ========================================================
echo  Starting Smart Hospital Management System - Backend
echo ========================================================
set "JAVA_HOME=C:\Program Files\Java\jdk-23"
set "PATH=%JAVA_HOME%\bin;%PATH%"
cd /d "%~dp0backend"
call "%~dp0tools\apache-maven-3.9.9\bin\mvn.cmd" spring-boot:run
pause
