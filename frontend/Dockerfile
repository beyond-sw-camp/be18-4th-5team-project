# ===== 1) Build stage =====
FROM node:20-alpine AS build
WORKDIR /app

# deps 캐시 최적화
COPY package*.json ./
RUN npm ci

# 소스 복사 후 빌드 (Vite -> dist/)
COPY . .
RUN npm run build

# ===== 2) Runtime stage (Nginx) =====
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Nginx 설정
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 정적 산출물 복사
COPY --from=build /app/dist ./

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
