FROM node:latest
LABEL maintainer="hmasad09@gmail.com"
WORKDIR /usr/src/app
COPY package*.json ./
VOLUME [ "/usr/src/app" ]
RUN npm install
ENV NODE_ENV=development
ENV PORT=3000
EXPOSE 3000
RUN npm install -g nodemon
CMD [ "nodemon", "-L", "nodeapp/index.js" ]
