# Backend (Node + Express + Sequelize)
FROM node:20-alpine

WORKDIR /app

# Install deps first (better layer caching)
COPY package*.json ./
RUN npm ci --omit=dev

# App source
COPY . .

ENV NODE_ENV=production
EXPOSE 5000

CMD ["npm","start"]
