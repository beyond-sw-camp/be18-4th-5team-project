FROM nginx:stable-alpine3.21
LABEL maintainer="hong123 <hong123@beyond.com>"
LABEL version="1.0"
COPY dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
ENV TZ=Asia/Seoul
EXPOSE 81
CMD [ "nginx", "-g", "daemon off;" ]