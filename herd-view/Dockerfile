# Builder stage
FROM node:current-alpine3.11 As builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build --prod


# Production stage
FROM nginx:latest

COPY --from=builder /usr/src/app/dist/herd-view/ /var/www/html
