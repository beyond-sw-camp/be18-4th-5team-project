FROM eclipse-temurin:17-jdk
LABEL maintainer="sangwon <chosw0410@naver.com>"
LABEL version="1.0"
COPY jwttest-0.0.1-SNAPSHOT.jar /root
ARG BUILD_PROFILE=dev
ARG BUILD_PORT=8080
ENV TZ=Asia/Seoul
ENV APP_PROFILE=${BUILD_PROFILE}
EXPOSE ${BUILD_PORT}
WORKDIR /root
CMD [ "java", "-jar", "jwttest-0.0.1-SNAPSHOT.jar", "--spring.profiles.active=${APP_PROFILE}" ]