FROM node:lts

ENV TZ="Asia/Jakarta"
ENV PS1="\u@\h:\w\\$"

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json .

RUN npm install -g npm@10.2.0

RUN npm install

# COPY app.js ./

EXPOSE 3000

CMD ["npm", "run", "dev"]