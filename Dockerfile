# Builder
FROM node:18 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install && \
    npm install @tailwindcss/oxide-linux-x64-gnu --no-save && \
    npm cache clean --force
COPY . .
RUN npm run build

# Production
FROM node:18-alpine
WORKDIR /app
RUN npm i -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]