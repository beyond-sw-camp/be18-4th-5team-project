FROM eclipse-temurin:21-jre-alpine-3.22
LABEL maintainer="hong123 <hong123@beyond.com>"
LABEL version="1.0"
COPY ./target/department-service-0.0.1-SNAPSHOT.jar /root
ARG BUILD_PROFILE=dev
ARG BUILD_PORT=8088
ENV TZ=Asia/Seoul
ENV APP_PROFILE=${BUILD_PROFILE}
EXPOSE ${BUILD_PORT}
WORKDIR /root
CMD [ "java", "-jar", "department-service-0.0.1-SNAPSHOT.jar", "--spring.profiles.active=${APP_PROFILE}" ]