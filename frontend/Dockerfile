FROM node:alpine3.22 as builder
WORKDIR /app
COPY ./ .
RUN npm install
RUN npm run build
FROM nginx:stable-alpine3.21
LABEL maintainer="hong123 <hong123@beyond.com>"
LABEL version="1.0"
COPY --from=builder /app/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
ENV TZ=Asia/Seoul
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]