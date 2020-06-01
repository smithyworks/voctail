# base image
FROM node:latest

# setting the work direcotry
WORKDIR /usr/src/app

ENV PORT=80

ENV DB_USER=postgres
ENV DB_HOST=localhost
ENV DB_NAME=voctail_db
ENV DB_PASS=password
ENV DB_PORT=5432

ENV ACCESS_TOKEN_SECRET=da45062b1c9e15f6472968408852bb08ea19a90f99993dddf0b89590bfa414379e27e2be255c76d1c0c46e6db0ae32dd2a03916ce6c11917ae4f443df6477bde
ENV REFRESH_TOKEN_SECRET=b8a31b3dae2c46cd3954551ec42016b7cd1622e699f8de23515c0733ef9e884d5d3b996cc4eadf238e478ee9bb98b054585b825f5a29af8184c12a8dfec362c0

# copy package.json
COPY ./package*.json ./

# install dependencies
RUN npm install

# COPY src
COPY ./lib ./lib
COPY ./frontend_build ./frontend_build
COPY ./server.js ./server.js

EXPOSE 80

RUN node -v

CMD ["node","."]