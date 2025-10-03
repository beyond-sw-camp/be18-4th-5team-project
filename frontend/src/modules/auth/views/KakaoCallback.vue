<template>
  <div class="kakao-callback">
    <p>카카오 로그인 처리 중입니다. 잠시만 기다려주세요...</p>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const code = route.query.code;

if (code) {
  fetch(`http://localhost:8080/api/v1/auth/kakao/callback?code=${code}`, {  // ✅ API prefix 맞추기
    method: "GET",
    credentials: "include",
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("로그인 실패");
      }
      return res.json();
    })
    .then((data) => {
      console.log("백엔드 응답:", data);

      // ✅ 토큰 + 닉네임 저장
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("nickname", data.nickname);

      // ✅ 홈으로 이동
      router.push("/");
    })
    .catch((err) => {
      console.error("카카오 로그인 처리 에러:", err);
      alert("카카오 로그인에 실패했습니다.");
      router.push("/login");
    });
} else {
  console.error("인가 코드 없음");
  router.push("/login");
}
</script>

<style scoped>
.kakao-callback {
  text-align: center;
  margin-top: 50px;
  font-size: 16px;
  color: #444;
}
</style>
