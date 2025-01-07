FROM node:lts-alpine
ARG VERSION_PATCH=0.0.1
WORKDIR /app
COPY . .
RUN sed -i "s/0.2.0/${VERSION_PATCH}/"  /app/package.json
RUN npm install
RUN npm run build