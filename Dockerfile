FROM node:18-alpine

WORKDIR /app_backend_img

COPY . .

RUN npm install --force

EXPOSE 5000

CMD ["npm", "start"]