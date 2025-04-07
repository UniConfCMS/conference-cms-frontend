FROM node:18-alpine

WORKDIR /conference-cms-frontend

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]