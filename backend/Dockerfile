FROM node:18-alpine
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.7.0 /lambda-adapter /opt/extensions/lambda-adapter

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

# Tell Lambda Adapter that our app listens on port 3000
ENV AWS_LWA_PORT=3000
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]
