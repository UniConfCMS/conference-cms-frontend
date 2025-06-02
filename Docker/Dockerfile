FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN  npm install axios

RUN npm install react-router-dom @types/react-router-dom

RUN npm install react-quill quill

RUN npm install quill-image-resize-module-react

COPY . .


EXPOSE 3000

CMD ["npm", "start"]
