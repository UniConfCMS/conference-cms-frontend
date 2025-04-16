FROM node:18-alpine

WORKDIR /app

COPY package*.json ./


COPY . .

RUN chmod +x Docker/entrypoint.sh  

ENTRYPOINT ["Docker/entrypoint.sh"]