@echo off
echo "Waiting 3 seconds before checking port 6800..."
timeout /t 5 /nobreak >nul

echo "Checking and killing any process using port 6800..."
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :6800') do taskkill /PID %%a /F

echo "Starting Spring Boot application with Maven in a new window..."
start cmd /k "mvn spring-boot:run"

echo "Deployment script finished. Spring Boot running in separate window."