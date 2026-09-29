FROM node:22-alpine
WORKDIR /app
COPY ./site /app/
* RUN rm -rf /app/node_modules
RUN npm install ejs && npm install
CMD ["npm","start"]
