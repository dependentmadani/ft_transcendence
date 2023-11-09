FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm i

EXPOSE 5173

# npm install @mui/material @emotion/react

RUN npm run build

CMD [ "npm", "run", "dev" ]