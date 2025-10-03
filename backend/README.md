<div align="center">
  
![header](https://capsule-render.vercel.app/api?type=waving&color=0:ff7eb3,100:65c7f7&height=220&section=header&text=농구있네+축구싶냐+야구르징&fontSize=34&fontColor=ffffff&desc=·플링톡+PlayLinkTalk-project·&descAlignY=70&descSize=18&animation=fadeIn)

![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=32&pause=1000&color=000000&center=true&vCenter=true&width=1500&lines=⏱️시간+기반으로+사용자를+실시간+매칭해+운동+활동을+중개하는+서비스)

<img src="/readme_images/PLINKTALK_LOGO.png" alt="PlayLinkTalk Logo" width="260"/>
  
</div>

<br /><br />

---

## 👥 팀원 소개

<table align="center">
  <tr>
    <td align="center"><strong>김민수</strong><br>
      <a href="https://github.com/minsu47722" target="_blank">
        <img src="readme_images/퉁퉁이.jpg" width="100px"><br>@minsu47722
      </a>
    </td>
    <td align="center"><strong>김재상</strong><br>
      <a href="https://github.com/jaesangE" target="_blank">
        <img src="readme_images/이슬이2.jpg" width="100px"><br>@jaesangE
      </a>
    </td>
    <td align="center"><strong>이승진</strong><br>
      <a href="https://github.com/Jintory" target="_blank">
        <img src="readme_images/도라미2.jpg" width="100px"><br>@Jintory
      </a>
    </td>
    <td align="center"><strong>이진구</strong><br>
      <a href="https://github.com/LeeJingu01" target="_blank">
        <img src="readme_images/노진구.jpg" width="100px"><br>@LeeJingu01
      </a>
    </td>
    <td align="center"><strong>임성민</strong><br>
      <a href="https://github.com/baechuking" target="_blank">
        <img src="readme_images/비실이.jpg" width="100px"><br>@baechuking
      </a>
    </td>
    <td align="center"><strong>최유경</strong><br>
      <a href="https://github.com/kyounggg" target="_blank">
        <img src="readme_images/도라에몽.jpg" width="100px"><br>@kyounggg
      </a>
    </td>
  </tr>
</table>


---

## 📌 목차

1. [개요](#1-개요)
2. [프로젝트 주요기능](#2-프로젝트-주요기능)
3. [프로젝트 기대 효과](#3-프로젝트-기대-효과)
4. [기술 스택](#4-기술-스택)
5. [아키텍쳐](#5-아키텍쳐)
6. [요구사항 정의서](#6-요구사항-정의서)
7. [테이블 명세서](#7-테이블-명세서)
8. [ERD](#8-ERD)
9. [API 명세서](#9-API-명세서)
10. [테스트 명세서](#10-테스트-명세서)
11. [회고](#10-회고)
---

# 1. 개요

본 프로젝트는 사용자가 **운동 가능한 시간대**를 입력하면, 같은 시간에 운동을 원하는 파트너를 **실시간으로 매칭**해주는 서비스다.  
정기적인 모임에 얽매이지 않고, 원할 때 가볍게 참여할 수 있는 **일회성·즉시성 기반 운동 경험**을 제공한다.  


## 2. 배경
- **기존 서비스**
<img src="/readme_images/image (2).png" alt="4" width="500"/>

기존 서비스가 ‘정기 모임’ 중심이라면, **우리 서비스는 ‘가벼운 번개 모임’ 중심**이다.  
시간과 약속에 얽매이지 않고, 남는 시간에 **즉시 운동 참여**가 가능하도록 설계했다.  

<img src="/readme_images/{49E2E0A0-8005-473C-A1FA-6B130751604A}.png" alt="1" width="500"/>

현대인에게 운동은 단순한 취미가 아니라 **건강 관리와 체력 유지**를 위한 필수 요소다.  
그러나 현실에서는 가장 큰 걸림돌이 있다. 바로 **시간 부족**이다.  

바쁜 일상으로 인해 정기적인 운동 시간을 확보하기 어렵다. 설령 시간이 나더라도 **함께 운동할 파트너를 찾는 일**이 쉽지 않다.  



- **시간적 제약**
<img src="/readme_images/image.png" alt="2" width="500"/>

특히 **축구·농구·배드민턴**과 같은 구기 종목은 혼자서는 즐길 수 없다.  
학생 시절에는 수업·동아리 활동으로 쉽게 팀을 꾸릴 수 있었지만, 사회인이 된 후에는 **최소 인원조차 모으기 힘든 상황**이 잦다.  
동호회나 조기축구회도 있지만, **가입·출석·회비 등 정기적인 부담**이 장벽이 된다.  

<img src="/readme_images/image (1).png" alt="3" width="500"/>

> 📊 국민체육진흥공단 조사에 따르면, 국민의 **88.2%가 생활체육 동호회에 가입하지 않았으며**,  
> 그 이유 중 상당수가 **시간 제약**과 **정기 모임 참여 부담**이었다.  

이 통계는 현대인들이 **운동 욕구와 현실적 제약 사이의 큰 간극**을 겪고 있음을 보여준다.  


## 3. 기존 서비스와의 차별점

### 기존 서비스
- 시간 제약 : 정해진 요일과 시간에 참석해야 한다.

- 참여 부담 : 회비, 출석, 규칙 준수 등 지속적인 관리 요소가 따른다.

- 참여 유연성 부족 : 갑작스러운 일정 변경이나 즉흥적인 참여가 어렵다.

### PLINKTALK

- 즉시성 : 사용자는 운동이 하고 싶을 때 바로 참여할 수 있다.
  
- 일회성 : 정기적인 참여에 대한 부담을 줄일 수 있다.

- 참여 유연성 : 원하는 시간대를 설정해 상황에 맞는 운동 파트너를 찾을 수 있다.

## 4. 핵심 가치 제안

- ⏱️ **간편한 참여**: 가입·소개글·승인 절차 없이 바로 조건 입력  
- 💬 **원활한 소통**: 매칭 즉시 전용 채팅방 자동 생성  
- 🏃 **순수 운동 지향**: 네트워킹보다 *운동 자체의 몰입*을 우선  
- ⚡ **번개 문화 최적화**: “오늘 갑자기 농구?” 같은 *즉흥 수요* 바로 연결  
- 🤝 **사용자 친화성**: 커뮤니티·친구 기능 제공으로 지속적 유저 경험 강화  


## 5. 프로젝트 목적

- **시간 제약 해소**: 바쁜 현대인도 원하는 시간에 바로 운동  
- **파트너 확보 용이**: 함께할 사람을 구하는 번거로움 해소  
- **정기 모임 부담 완화**: 동호회 없이도 자유롭게 참여 가능  
- **순수 운동 경험 제공**: 만남/네트워킹보다 *운동 본질*에 집중  

---

# 2. 프로젝트 주요기능

- **⚡ 실시간 매칭**  
&nbsp;&nbsp;&nbsp;- 사용자가 입력한 시간대·종목 조건에 맞는 파트너 자동 매칭<br>
&nbsp;&nbsp;&nbsp;- 원하는 시간대에 즉시 운동 인원 확보 가능  

- **💬 실시간 채팅**  
&nbsp;&nbsp;&nbsp;- 매칭된 사용자 혹은 친구 간 1:1 / 그룹 대화 가능<br>
&nbsp;&nbsp;&nbsp;- 약속 시간·장소 조율 및 세부사항 공유  

- **📝 게시판**  
&nbsp;&nbsp;&nbsp;- 자유 게시판을 통한 소통 및 정보 공유<br>
&nbsp;&nbsp;&nbsp;- 운동 후기, 모임 모집, 꿀팁 작성 가능  

- **👤 마이페이지**  
&nbsp;&nbsp;&nbsp;- 개인 정보 및 선호 종목 관리<br>
&nbsp;&nbsp;&nbsp;- 매칭·참여 이력 조회 및 활동 기록 확인  

- **🔐 회원관리**  
&nbsp;&nbsp;&nbsp;- 회원가입, 로그인, 권한 관리 제공<br>
&nbsp;&nbsp;&nbsp;- 신고 등 안전한 서비스 운영 지원  

- **🤝 친구 기능**  
&nbsp;&nbsp;&nbsp;- 관심 있는 사용자 친구 추가 가능<br>
&nbsp;&nbsp;&nbsp;- 재매칭 및 활동 알림 제공  

---

# 3. 프로젝트 기대 효과

## 1. 시간적 제약 해소

사용자는 별도의 정기 모임이나 동호회에 얽매이지 않고, **자신이 가능한 시간에 맞춰 즉시 운동 파트너를 찾을 수 있다.**

---

## 2. 참여 장벽 완화

- 복잡한 가입 절차, 모임 승인, 지속적인 출석 부담이 없다.
- 원하는 조건(종목·시간·지역·성별)만 입력하면 **자동 매칭 → 자동 채팅방 생성 → 바로 소통**이 가능해 **참여 진입 장벽이 크게 낮아진다.**

---


# 4. 기술 스택

### BACKEND


![java](https://github.com/user-attachments/assets/a9cd03e7-07d6-477e-b3dd-32e7a6ae1e08)
![jpa](https://github.com/user-attachments/assets/dd9fdaec-6850-4401-9c67-af2da34ddf5d) 
<img src="https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white">
![jwt](https://github.com/user-attachments/assets/83bddf8b-d556-4e60-8391-2074704103c4)
<img src="https://img.shields.io/badge/SpringBoot-10B146?style=for-the-badge&logo=SpringBoot&logoColor=white">
<img src="https://img.shields.io/badge/SpringSecurity-3B66BC?style=for-the-badge&logo=SpringSecurity&logoColor=white">


### FRONTEND
  
<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
<img src="https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white">
<img src="https://img.shields.io/badge/Pinia-F8E162?style=for-the-badge&logo=pinia&logoColor=black">
<img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white">
<img src="https://img.shields.io/badge/VS%20Code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white">



### DATABASE


![redis](https://github.com/user-attachments/assets/df929d81-ce2f-4853-97fd-cdf7bf45907e) ![mariadb](https://github.com/user-attachments/assets/19a0ad09-804d-4303-80bd-32cafdae0e6f)




### ETC


![postman](https://github.com/user-attachments/assets/4bcd5043-6841-4cd1-b864-dec4dc39f918)
<img src="https://img.shields.io/badge/SSE-FF6F00?style=for-the-badge&logo=serverfault&logoColor=white">
<img src="https://img.shields.io/badge/WebSocket-008080?style=for-the-badge&logo=socket.io&logoColor=white">



### IDE


![intellij](https://github.com/user-attachments/assets/25d426ed-e30e-4619-9968-11375adba8b9)

<br><br>

# 5. 아키텍쳐

<img width="1930" height="1172" alt="image" src="https://github.com/user-attachments/assets/17988b3a-8b03-4572-8746-1618733b0e08" />

---

# 6. 요구사항 정의서

[요구사항 정의서](https://docs.google.com/spreadsheets/d/1293Cmz0EkIeH163VswqcNQPK-0b8Cr8gXvtHyckqLN8/edit?gid=0#gid=0&fvid=1857363008)

<img width="1188" height="753" alt="image" src="https://github.com/user-attachments/assets/a27574d1-482f-4735-bb4f-5f8843e8fd44" />

---

# 7. 테이블 명세서

[테이블 명세서](https://docs.google.com/spreadsheets/d/1293Cmz0EkIeH163VswqcNQPK-0b8Cr8gXvtHyckqLN8/edit?gid=99972625#gid=99972625)

<img width="924" height="691" alt="image" src="https://github.com/user-attachments/assets/50838fc5-ea4f-454b-8a4c-05bd6161605c" />

---

# 8. ERD

[ERD](https://www.erdcloud.com/d/mrc7T5gfD8iZbYr8P)

<img width="1506" height="714" alt="image" src="https://github.com/user-attachments/assets/61614c7d-d75d-4fed-b36b-e297d1ece750" />

---

# 9. API 명세서

[API 명세서](https://www.notion.so/API-24f80955955380be8f0deade40d16847)

<img width="1543" height="856" alt="image" src="https://github.com/user-attachments/assets/9eaf974a-32ce-4e7c-ae53-a2fdedb28a8d" />

---

# 10. 테스트 명세서

[테스트 명세서](https://docs.google.com/spreadsheets/d/1293Cmz0EkIeH163VswqcNQPK-0b8Cr8gXvtHyckqLN8/edit?gid=840718577#gid=840718577)

---

# 11. 회고록
| 이름         | 회고 내용       |
|--------------|--------------|
|      김민수        |       주제 선정, DB 설계, 백엔트, 프론트엔드까지 처음으로 모든 과정에 참가해서 하나의 파트를 완성한 첫 번째 프로젝트였습니다. 이전에 했던 프로젝트와 다르게 모든 부분에 관여하다보니 서로가 어떻게 엮어져 있고, 좋은 프로그램을 만들기 위해서는 단순히 백엔드, 프론트엔드 개발자를 희망한다고 백엔드나 프론트엔드만 알아선 안된고 모든 것을 알고 설계부터 구현의 과정까지 다른 영역까지 고려해야 한다는 점을 느꼈습니다. 또한 저번 프로젝트와 똑같이 설계의 중요성을 절실히 체감했습니다. 프로젝트 기간의 절반 이상을 써도 무방하다 느낄 정도로 설계가 굉장히 중요해서, 초기 설계와 달라지는 점이 있다면 시간 소요가 굉장히 크고 기존에 개발했거나 추후 개발할 부분까지 영향이 간다고 느꼈습니다. 이번 프로젝트에서는 백엔드, 프론트엔드 수업을 들으면서 동시에 프로젝트를 진행했기 때문에, 각 부분에 있어서 '내가 어느 정도까지 알고 있고, 어느 정도까지 구현이 가능할까?'에 대해 감이 제대로 잡히지 않았기 때문에 꼼꼼한 설계가 되지 않았는데, 좋은 프로그램을 위해선 현재 나의 레벨을 파악해야 하는 과정이 먼저 필요하다 느꼈습니다. 또한 백엔드, 프론트엔드가 각 파트별로 다른 조원들과의 연결점이 생기고 깃허브를 이용하여 프로젝트를 진행했기 때문에 소통이 얼마나 중요한지, 좋은 소통이 프로그램을 좋은 방향으로 이끌고 나쁜 소통이 프로젝트를 얼마나 힘들게 만드는지 또한 느꼈습니다. 전체적으로 프로젝트를 진행하면서 spring, vue, jpa에 대해서도 많이 익히고 모르는 부분도 학습할 수 있으며 프로젝트 진행 중 일어날 수 있는 다양한 경험을 했기에 프로젝트 기반 학습을 제대로 했구나라는 생각이 들어 뿌듯합니다.    |
|      김재상        |       백엔드 프론트엔드 프로젝트를 진행하면서 처음 사용해보는 프레임워크들을 사용할 수 있어 좋았고 API를 작성해보고 직접 데이터베이스와 연결하여 데이터들을 활용하는 과정이 재미있었습니다. 전체적으로 프로젝트를 구현할 때 시간이 많이 부족하다고 느꼈고 시간이 더 있었다면 부족한 점들을 보완하거나 기능을 추가할 수 있었을텐데라는 아쉬움이 남았습니다. 프로젝트 개발의 전체흐름을 느껴볼 수 있었고 앞으로의 프로젝트에서도 많은 것을 적용할 수 있겠다는 생각이 드는 좋은 경험이었습니다. |
|      이승진        |       &emsp;이번 프로젝트는 프론트엔드, 백엔드, 설계, 디자인까지 거의 모든 과정을 직접 경험할 수 있었다는 점에서 큰 의미가 있었습니다. 이전에는 파트를 나눠 맡은 역할에만 집중했지만, 이번에는 기능 하나를 처음부터 끝까지 구현해보면서 서비스가 전체적으로 어떻게 돌아가는지 더 깊이 이해할 수 있었습니다. 단순히 코드를 짜는 데 그치지 않고, 기획과 설계부터 화면 구성, API 연동, 최종 서비스 동작까지 이어지는 흐름을 직접 밟아보니 시야가 확실히 넓어졌습니다. 개발적으로는 Spring Boot와 Vue를 연동해 로그인·회원가입 기능을 구현하고, JWT 기반 인증을 적용하며 인증 흐름을 처음부터 끝까지 다뤄볼 수 있었습니다. 여기에 카카오 API 소셜 로그인까지 적용하면서 실제 서비스에서 자주 쓰이는 기능을 직접 구현해본 경험도 의미 있었습니다.<br>  &emsp;프로젝트를 진행하며 가장 크게 느낀 점은 설계의 중요성이었습니다. API 구조나 DB 스키마를 초반에 어떻게 잡느냐가 이후 개발 속도와 난이도를 크게 좌우했습니다. 초반에 대충 정한 부분은 요구사항이 늘어날수록 손보기가 점점 힘들어졌고, 코드 양이 많아지면서 리뷰와 협업에도 더 많은 시간이 필요했습니다. 이 과정에서 커뮤니케이션 방식 하나하나가 효율에 큰 영향을 미친다는 것도 체감했습니다. 다행히 팀원들과 함께 원인을 분석하고 해결책을 찾아가며 협업의 진짜 의미를 배울 수 있었습니다. 혼자였다면 오래 걸렸을 문제도 함께 고민하니 훨씬 빠르게 풀렸고, 그 과정에서 서로의 코드 스타일이나 설계 방식까지 배우며 성장할 수 있었습니다.<br> &emsp;이번 프로젝트는 배움과 성취가 모두 있었던 값진 경험이었습니다. 단순히 기능 구현에 그치지 않고, “이 기능이 서비스 전체 안에서 어떤 의미를 가지는가”까지 고민할 수 있었던 점이 특히 인상 깊었습니다.       |
|      이진구        |       첫 번째로 했던 프로젝트와는 달리 데이터베이스 설계, 백엔드 구현, 프런트 엔드 구현, 깃 허브까지 연동해서 한 프로젝트라 시간과 노력을 더 쏟아냈던 것 같습니다. 또한 기간도 첫 번째와는 달리 길어서 팀원과의 회의를 통해서 설계부터 구현까지 이어가면서 했던 것에 대해서 많은 성장을 했던 것 같습니다. 하지만 이런 정교한 프로젝트를 처음 하다 보니 수업과 공부의 시간 분배를 잘 하지 못했던 것에서 아쉬움이 남아있습니다. 이번 프로젝트를 통해서 개발자로서의 길에 한 단계 앞으로 나아간 것 같고 성공과 실패를 동시에 겪으면서 정신적으로도 많이 성장했었던 좋은 경험이었습니다.|
|      임성민        |       이번 프로젝트를 진행하게 되면서 백엔드 기능와 프론트엔드 기능을 처음으로 직접 제작하게 되었습니다. 아무래도 다른 조원들은 프로젝트 경험이 있지만 저는 처음이어서 백엔드를 개발 시작했을 때부터 매우 막막했었지만 다행히 수업 때 들었던 것들과 실습을 바탕으로 조원들의 도움을 받아서 제가 맡은 백엔드와 프로트엔드 기능들을 구현할 수 있었습니다. 제 손으로 기능 구현을 완료했을 때의 행복감은 정말로 컸습니다. 이 경험을 바탕으로 더 나은 프로젝트 개발 능력을 가지고 최종 프로젝트를 더 잘 만들 수 있도록 노력할 것입니다.       |
|      최유경        |        처음 사용해보는 Spring Boot와 Vue.js 프레임워크를 사용해 구현을 시작할 때는 막막함이 컸습니다. 하지만 덕분에 수업 시간에 배운 내용을 실제로 적용하며 복습하고, 스스로 부족한 개념이 무엇인지 알고 더 공부 할 수 있는 시간이었습니다. 무엇보다 단순히 개념만 공부할 때와 달리, 프로젝트를 통해 프론트엔드와 백엔드가 실제로 어떻게 데이터를 주고받는지, 전체적인 서비스가 어떤 구조로 동작하는지를 파악할 수 있었던 점이 가장 좋았습니다. 또한 기획 단계에서의 체계화된 문서 작성 여부가 이후의 수정 작업을 얼마나 편리하게 만드는지, 그리고 명확한 테스트 명세서 작성이 얼마나 중요한지 알 수 있었습니다. <br> 어려운 점도 많았지만, 힘들때는 서로 격려해주며 팀원들 덕분에 혼자서는 못할 프로젝트를 완성해낼 수 있었습니다. 그렇기에 이번 프로젝트는 코딩 실력이나 지식을 넘어 진정한 협업을 배울 수 있었으며 함께 고생한 팀원들에게 고맙다는 말을 전하고 싶습니다. 이 경험을 발판 삼아 다음에는 더 체계적이고 완성도 높은 서비스를 만드는 개발자가 되고 싶습니다.      |