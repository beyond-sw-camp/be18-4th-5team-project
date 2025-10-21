FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
COPY ./ .
RUN ["mvn", "package", "-DskipTests"]
FROM eclipse-temurin:21-jre-alpine-3.22
COPY --from=builder ./target/nongchukya-0.0.1-SNAPSHOT.jar /root
ARG BUILD_PROFILE=dev
ARG BUILD_PORT=8087
ENV TZ=Asia/Seoul
ENV APP_PROFILE=${BUILD_PROFILE}
EXPOSE ${BUILD_PORT}
WORKDIR /root
CMD [ "java", "-jar", "nongchukya-0.0.1-SNAPSHOT.jar", "--spring.profiles.active=${APP_PROFILE}" ]