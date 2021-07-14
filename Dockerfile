FROM node:14

WORKDIR /app

RUN npm i -g  serve

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 5000

CMD serve -s public/build
