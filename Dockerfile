FROM node:20-alpine3.18
# Create app directory
WORKDIR /data/app
# Copy Files
# https://xdhuxc.github.io/posts/docker/docker-copy-file-or-folder-one-command/
COPY . /data/app/
# Execute commands
RUN mkdir -vp static/configs \
  && mkdir -vp static/m3u8s \
  && npm install -g pm2 \
  && pm2 install pm2-logrotate \
  && npm install \
  && npm run build

# 暴露端口
EXPOSE 8080
# 执行命令
CMD [ "npm", "run", "prod:docker" ]

# 在最后，以 node 用户来运行应用程序
USER node
