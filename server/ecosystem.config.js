module.exports = {
  apps: [{
    name: "vector-bff",
    script: "./dist/app.js",
    instances: "max",
    exec_mode: "cluster",
    env: {
      NODE_ENV: "development",
      PORT: 3001,
      USE_MOCK_DATA: "true"
    },
    env_production: {
      NODE_ENV: "production",
      PORT: 3001,
      USE_MOCK_DATA: "false",
      BACKEND_API_URL: "https://api.example.com" // 替换为实际的后端API地址
    },
    watch: false,
    max_memory_restart: "1G",
    merge_logs: true,
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    error_file: "logs/pm2-error.log",
    out_file: "logs/pm2-out.log"
  }]
};
