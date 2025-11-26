FROM node:20-alpine

WORKDIR /app

# Installera bara beroenden först
COPY package*.json ./
RUN npm install --production

# Kopiera in resten av koden
COPY . .

ENV PORT=3000
EXPOSE 3000
