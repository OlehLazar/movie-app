# 🎬 Movie App Frontend

The project is implemented in Vite + React, packaged in Docker, and supports backend address configuration via environment variables.

---

## ⚙️ Requirements

- Docker
- Node.js (optional — only if you run without Docker)

---

## 🚀 Running with Docker

The program supports launching in **1 line** with passing the environment variable `API_URL`, which points to the backend address:

docker run --name movies -p 3000:80 -e API_URL=http://localhost:8000/api/v1 rast145/movie-app

🐳 DockerHub link: https://hub.docker.com/r/rast145/movie-app

 
