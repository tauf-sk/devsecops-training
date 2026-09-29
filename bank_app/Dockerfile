FROM node:22-alpine@sha256-2c752226d477b4a886378baa95b9af252be59301b725fdb0b7e15208131505a8
WORKDIR /app
COPY ./site /app/
* RUN rm -rf /app/node_modules
RUN npm install ejs && npm install
CMD ["npm","start"]
