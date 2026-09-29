FROM node:22-alpine@sha256:2c752226d477b4a886378baa95b9af252be59301b725fdb0b7e15208131505a8
WORKDIR /app
COPY site/package.json ./
# RUN rm -rf /app/node_modules
RUN npm install ejs && npm install
COPY site/ ./
CMD ["npm","start"]
