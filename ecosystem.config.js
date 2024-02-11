const { name } = require('./package.json')
const path = require('path')

const logFile = path.resolve(__dirname, `./logs/${name}.pm2.log`)
module.exports = {
  apps: [
    {
      name,
      script: path.resolve(__dirname, './index.js'),
      instances: require('os').cpus().length,
      autorestart: true,
      out_file: logFile,
      error_file: logFile,
      merge_logs: true,
      watch: [
        'dist',
        'static/configs'
      ],
      env_production: {
        IS_PM2: true,
        NODE_ENV: 'production',
        PORT: 8080
      }
    }
  ]
}
