# ====== Build stage =====
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Maven Wrapper + 설정 먼저 복사
COPY mvnw ./
COPY .mvn/ .mvn/
COPY pom.xml ./

# Windows 권한/CRLF 이슈 대비
RUN chmod +x mvnw

# 의존성만 먼저 받아서 캐시 생성
RUN ./mvnw -B -DskipTests dependency:go-offline

# 소스 복사 후 실제 빌드
COPY src/ src/
RUN ./mvnw -B -DskipTests clean package
# 디버깅 시: RUN ls -al target

# ===== Runtime stage =====
FROM eclipse-temurin:21-jre
WORKDIR /app

# 런타임 기본값
ENV TZ=Asia/Seoul \
    APP_PROFILE=dev \
    SERVER_PORT=8080 \
    JAVA_OPTS=""

# 빌드 산출물 복사
COPY --from=build /app/target/*.jar /app/app.jar

# 컨테이너 내부 포트
EXPOSE ${SERVER_PORT}

# exec + sh -c: ENV 확장 + 신호 전달
ENTRYPOINT ["sh","-c","exec java $JAVA_OPTS -jar /app/app.jar --server.port=${SERVER_PORT} --spring.profiles.active=${APP_PROFILE}"]
