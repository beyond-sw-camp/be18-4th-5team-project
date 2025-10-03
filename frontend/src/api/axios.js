// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

// 요청 인터셉터 → AccessToken 자동 붙이기
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터 → AccessToken 만료 시 자동 재발급
api.interceptors.response.use(
  (response) => response, // 성공 그대로 리턴
  async (error) => {
    const originalRequest = error.config;

    // 401 Unauthorized & 재시도 안했을 때만
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // refresh 요청
        const { data } = await api.post("/api/v1/auth/refresh");

        // 새 토큰 저장
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        // 헤더 갱신 후 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("❌ 토큰 재발급 실패:", refreshError.response?.data || refreshError.message);
        // refresh 실패 → 로그아웃 처리
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
