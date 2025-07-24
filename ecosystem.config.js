module.exports = {
  apps: [
    {
      name: "vector-web-frontend",
      script: "npm",
      args: "run dev",
      cwd: "./",
      instances: 1,
      exec_mode: "fork",
      interpreter: "none",
      env: {
        NODE_ENV: "development",
        PORT: 5173,
        HOST: "0.0.0.0"
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5173,
        HOST: "0.0.0.0"
      },
      watch: false,
      max_memory_restart: "1G",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "logs/frontend-error.log",
      out_file: "logs/frontend-out.log",
      log_file: "logs/frontend-combined.log"
    },
    {
      name: "vector-web-server",
      script: "./server/dist/app.js",
      cwd: "./server",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
        PORT: 3001,
        HOST: "0.0.0.0",
        USE_MOCK_DATA: "true"
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3001,
        HOST: "0.0.0.0",
        USE_MOCK_DATA: "false",
        BACKEND_API_URL: "https://api.example.com"
      },
      watch: false,
      max_memory_restart: "1G",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "logs/server-error.log",
      out_file: "logs/server-out.log",
      log_file: "logs/server-combined.log"
    }
  ]
};
