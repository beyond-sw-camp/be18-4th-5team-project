<div align="center">
  
![header](https://capsule-render.vercel.app/api?type=waving&color=0:ff7eb3,100:65c7f7&height=220&section=header&text=농구있네+축구싶냐+야구르징&fontSize=34&fontColor=ffffff&desc=·플링톡+PlayLinkTalk-project·&descAlignY=70&descSize=18&animation=fadeIn)

![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=32&pause=1000&color=000000&center=true&vCenter=true&width=1500&lines=⏱️시간+기반으로+사용자를+실시간+매칭해+운동+활동을+중개하는+서비스)

<img src="/readme_images/PLINKTALK_LOGO.png" alt="PlayLinkTalk Logo" width="260"/>
  
</div>

<br /><br />

---

## 👥 팀원 소개

<table>
  <tr align="center">
    <td>박진우</td>
    <td>이진구</td>
    <td>윤석현</td>
    <td>조상원</td>
    <td>최유경</td>
  </tr>
  <tr align="center">
    <td><a target="_blank" href="https://github.com/JINWOO-0715"><img src="https://avatars.githubusercontent.com/u/55976921?v=4" width="100px"><br>@JINWOO-0715</a></td>
    <td><a target="_blank" href="https://github.com/LeeJingu01"><img src="https://avatars.githubusercontent.com/u/174857452?v=4" width="100px"><br>@LeeJingu01</a> </td>
    <td><a target="_blank" href="https://github.com/xxiuan"><img src="https://avatars.githubusercontent.com/u/156274066?v=4" width="100px"><br>@xxiuan</a> </td>
    <td><a target="_blank" href="https://github.com/sangwon5579"><img src="https://avatars.githubusercontent.com/u/81066249?v=4" width="100px"><br>@sangwon5589</a>  </td>
    <td><a target="_blank" href="https://github.com/kyounggg"><img src="https://avatars.githubusercontent.com/u/114654921?v=4" width="100px"><br>@kyounggg</a>  </td>
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
11. [CI/CD](#11-CI/CD)
12. [트러블 슈팅](#12-트러블-슈팅)
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

# 11. CI/CD

 ## 아키텍처

<img width="5342" height="6026" alt="image" src="https://github.com/user-attachments/assets/9bdefdb7-a832-49dd-b8a4-b0dbb9294d0f" />


## 시나리오

**1. 코드를 수정한 후 github develop에 최신 버전 프로젝트를 commit&push**<br>
  - 최신 버전 코드를 commit&push 하면 이벤트 발생<br>
    
**2. github는 webhook을 통해서 젠킨스에게 이벤트 전달**<br>

**3. 젠킨스는 파이프라인에 저장된 절차 실행**<br>
  - 현재 커밋과 이전 커밋 간의 변경을 감지한다
  - 변경된 백엔드/프론트엔드 파일이 있다면 build&push
  - 빌드를 통해 도커 이미지 생성 및 도커 허브에 push
  - `k8s/*.yml` 수정 및 Git push<br>

**4. argo CD는 Git 상태 자동 감지**<br>
  - fornt/back 각각의 변경에 대해서 무중단 배포 실행<br>
  
**5. webhook을 통해 Discode에게 파이프라인 결과 전달**<br>
  - 젠킨스에 설치한 Discode 플러그인을 통해 파이프라인 제목, 결과, 실행 시간이 담긴 Post를 Discode에 보냄
  - Discode봇이 데이터를 받아 지정한 Discode 서버에 실행 결과를 전송<br>

## CI/CD 파이프라인 스크립트
<details>
  <summary>Jenkins Pipline</summary>
  
  ````
  pipeline {
    agent {
        kubernetes {
            yaml '''
            apiVersion: v1
            kind: Pod
            metadata:
              name: jenkins-agent
            spec:
              containers:
              - name: docker
                image: docker:28.5.1-cli-alpine3.22
                command:
                - cat
                tty: true
                volumeMounts:
                - mountPath: "/var/run/docker.sock"
                  name: docker-socket
              volumes:
              - name: docker-socket
                hostPath:
                  path: "/var/run/docker.sock"                                
            '''
        }
    }

    environment {
            APP_IMAGE_NAME = 'leejingu/matching-vue'
            API_IMAGE_NAME = 'leejingu/matching-back'
            DOCKER_CREDENTIALS_ID = 'dockerhub-access'
            DISCORD_WEBHOOK_CREDENTIALS_ID = 'discord-webhook'
        }

    stages {
        stage('Detect Changes') {
            steps {
                script {
                    // 현재 커밋과 이전 커밋(HEAD~1) 간의 변경 파일을 가져온다.
                    def changedFiles = sh(script: 'git diff --name-only HEAD~1', returnStdout: true).trim().split("\n")

                    // 전체 배열을 줄바꿈으로 출력
                    echo "Changed files:\n${changedFiles.join('\n')}"

                    // 환경 변수 동적 설정 
                    env.SHOULD_BUILD_APP = changedFiles.any { it.startsWith("frontend/") } ? "true" : "false"
                    env.SHOULD_BUILD_API = changedFiles.any { it.startsWith("backend/") } ? "true" : "false"

                    echo "SHOULD_BUILD_APP : ${SHOULD_BUILD_APP}" 
                    echo "SHOULD_BUILD_API : ${SHOULD_BUILD_API}"
                }
            }
        }

        stage('Docker Login') {
            steps {
                container('docker') {
                    sh 'docker logout'

                    withCredentials([usernamePassword(
                        credentialsId: DOCKER_CREDENTIALS_ID,
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )]) {
                        sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                    }
                }
            }
        }

        stage('APP Image Build & Push') {
            when {
                expression {
                    return env.SHOULD_BUILD_APP == "true"
                }
            }

            steps {
                container('docker') {
                    dir('frontend') {
                        script {
                            def buildNumber = "${env.BUILD_NUMBER}"

                            withEnv(["DOCKER_IMAGE_VERSION=${buildNumber}"]) {
                                sh 'docker -v'
                                sh 'echo $APP_IMAGE_NAME:$DOCKER_IMAGE_VERSION'
                                sh 'docker build --no-cache -t $APP_IMAGE_NAME:$DOCKER_IMAGE_VERSION ./'
                                sh 'docker image inspect $APP_IMAGE_NAME:$DOCKER_IMAGE_VERSION'
                                sh 'docker push $APP_IMAGE_NAME:$DOCKER_IMAGE_VERSION'
                            }
                        }
                    }
                }
            }
        }

        stage('API Image Build & Push') {
            when {
                expression {
                    return env.SHOULD_BUILD_API == "true"
                }
            }

            steps {
                container('docker') {
                    dir('backend') {
                        script {
                            def buildNumber = "${env.BUILD_NUMBER}"

                            withEnv(["DOCKER_IMAGE_VERSION=${buildNumber}"]) {
                                sh 'docker -v'
                                sh 'echo $API_IMAGE_NAME:$DOCKER_IMAGE_VERSION'
                                sh 'docker build --no-cache -t $API_IMAGE_NAME:$DOCKER_IMAGE_VERSION ./'
                                sh 'docker image inspect $API_IMAGE_NAME:$DOCKER_IMAGE_VERSION'
                                sh 'docker push $API_IMAGE_NAME:$DOCKER_IMAGE_VERSION'
                            }
                        }
                    }
                }
            }
        }

        stage('Trigger k8s-manifests Job') {
            steps {
                script {
                    def buildNumber = "${env.BUILD_NUMBER}"

                    withEnv(["DOCKER_IMAGE_VERSION=${buildNumber}"]) {
                        build job: 'nongchukya-k8s-manifests',
                            parameters: [
                                string(name: 'DOCKER_IMAGE_VERSION', value: "${DOCKER_IMAGE_VERSION}"),
                                string(name: 'DID_BUILD_APP', value: "${env.SHOULD_BUILD_APP}"),
                                string(name: 'DID_BUILD_API', value: "${env.SHOULD_BUILD_API}")
                            ],
                            wait: true
                    }
                }
            }
        }
    }

    post {
        always {
            withCredentials([string(
                credentialsId: DISCORD_WEBHOOK_CREDENTIALS_ID,
                variable: 'DISCORD_WEBHOOK_URL'
            )]) {
                discordSend description: """
                제목 : ${currentBuild.displayName} 빌드
                결과 : ${currentBuild.result}
                실행 시간 : ${currentBuild.duration / 1000}s
                """,
                result: currentBuild.currentResult,
                title: "${env.JOB_NAME} : ${currentBuild.displayName}", 
                webhookURL: "${DISCORD_WEBHOOK_URL}"
            }
        }
    }
}

  ````
</details>

<details>
  <summary>k8s manifest Pipline</summary>

  ````
  pipeline {
    agent any

    parameters {
        string(name: 'DOCKER_IMAGE_VERSION', defaultValue: '', description: 'Docker Image Version')
        string(name: 'DID_BUILD_APP', defaultValue: '', description: 'Did Build APP')
        string(name: 'DID_BUILD_API', defaultValue: '', description: 'Did Build API')
    }

    stages {
        stage('Checkout Main Branches') {
            steps {
                sh 'git checkout main'
                echo "DOCKER_IMAGE_VERSION: ${params.DOCKER_IMAGE_VERSION}"
                echo "DID_BUILD_APP: ${params.DID_BUILD_APP}"
                echo "DID_BUILD_API: ${params.DID_BUILD_API}"
            }
        }

        stage('update front deploy.yaml') {
            when {
                expression {
                    return params.DID_BUILD_APP == "true"
                }
            }
            steps {
                // Jenkins 파이프라인에서 작업 디렉터리를 변경할 때 사용한다.
                dir('nongchukya-front') {
                    sh 'pwd'
                    sh 'ls -al'
                    echo "Received Docker Image Version : ${params.DOCKER_IMAGE_VERSION}"
                    sh "sed -i 's|leejingu/matching-vue:.*|leejingu/matching-vue:${params.DOCKER_IMAGE_VERSION}|g' deploy.yaml"
                    sh 'cat deploy.yaml'
                }
                
            }
        }
        
        stage('update back deploy.yaml') {
            when {
                expression {
                    return params.DID_BUILD_API == "true"
                }
            }
            steps {
                // Jenkins 파이프라인에서 작업 디렉터리를 변경할 때 사용한다.
                dir('nongchukya-back') {
                    sh 'pwd'
                    sh 'ls -al'
                    echo "Received Docker Image Version : ${params.DOCKER_IMAGE_VERSION}"
                    sh "sed -i 's|leejingu/matching-back:.*|leejingu/matching-back:${params.DOCKER_IMAGE_VERSION}|g' deploy.yaml"
                    sh 'cat deploy.yaml'
                }
                
            }
        }

        stage('Commit & Push') {
            when {
                expression {
                    return params.DID_BUILD_APP == "true" || params.DID_BUILD_API == "true"
                }
            }
            steps {
                sh 'git config --list'
                sh 'git config user.name "LeeJingu01"'
                sh 'git config user.email "sbeom11@naver.com"'
                sh 'git config --list'
                sh 'git add .'
                sh "git commit -m 'Update Image Version ${params.DOCKER_IMAGE_VERSION}'"
                sh 'git status'
                sshagent(['nongchukya-k8s-manifests']) {
                    sh 'git push'
                }
            }
        }
    }
}

  ````

</details>

## CI/CD 실행 결과
<details>
  <summary>Jenkins/argo CD</summary>

  https://www.youtube.com/watch?v=Un8148811AU
  
</details>

<details>
<summary>discord bot</summary>

<img width="1344" height="882" alt="image" src="https://github.com/user-attachments/assets/143b5be5-0a8c-4fb4-a27f-aa64d3494e80" />

</details>

## 주요 기능 시연 영상

https://github.com/user-attachments/assets/6c914a7b-ff29-472a-884a-4ffc39b6f854

---

# 12. 트러블 슈팅

> ### 🚧 `application.yml` 환경 변수화 및 Kubernetes 시크릿 암호화(`kubeseal`) 적용 <br>
**1️⃣ 문제 상황** <br>
  - Spring Boot의 `application.yml`에 민감한 정보가 직접 노출되어 있으므로 해당 설정이 GitHub 저장소에 올라가면 보안상 심각한 문제가 발생 할 수 있으므로 yml파일 제외 업로드 규칙 설정<br>
     **→ yml파일 부재로 Jenkins에서 자동 배포 시, 클러스터 내부에서는 환경 변수를 로드하지 못해 `CreateContainerConfigError` 가 발생함.** <br>
     
**2️⃣ 해결 과정** <br>
  1단계 — 환경 변수 기반으로 yml 수정<br>
    : `application.yml` 내 민감한 값들을 모두 환경 변수 참조로 변경 (로컬 실행 시 기본값(default value)을 함께 지정해 Jenkins/로컬 겸용으로 구성)<br>
  2단계 — Secret manifest 생성 (backend-secret.yaml)<br>
  3단계 — `kubeseal` 설치 및 암호화 수행<br>
  4단계 — SealedSecret 적용 (kubectl apply -f backend-sealedsecret.yaml)<br>
        → `sealed-secrets-controller`가 자동으로 `backend-secret` 복호화하여 생성<br>
        → `kubectl get secrets` 시 backend-secret 확인됨 ✅<br>
        → Pod 정상 기동 확인: container "matching-api" started successfully<br>
        
**3️⃣ 결과**<br>

<내용 추가>

**🧩 개선 방향**<br>
- Jenkins pipeline 내에서 `kubeseal` CLI 자동화
- 프론트엔드 `.env`도 Kubernetes ConfigMap으로 이관
<br>
    
> ### 🚧 Nginx Ingress에서 SSE/WebSocket 연결 끊김 문제 <br>
**1️⃣ 문제 상황** <br>
        - **SSE(Server-Sent Events)** 기반 실시간 알림 기능과
        **WebSocket** 기반 실시간 채팅 기능이 정상 작동하지 않음.
        - 클라이언트에서는 **연결 즉시 끊김** 또는 **403 / 400 에러** 발생.
        - 백엔드(Spring Boot) 로그에서는 연결 요청이 오지 않거나, 요청 직후 stream이 닫힘.
        - 동일한 코드가 로컬(`localhost`)에서는 정상 동작했음 → **Ingress 환경 문제로 추정**.
        
        ---
        
        원인 분석 
        
        - Spring Boot 애플리케이션은 SSE/WebSocket 연결을 **HTTP Keep-Alive 기반의 장시간 스트림**으로 유지.
        - 그러나 **기본 Nginx Ingress Controller 설정은 HTTP 요청을 60초(default)** 이후 강제로 닫음.
        - 또한 WebSocket의 경우 **HTTP/1.1 Upgrade 헤더**가 없으면 “업그레이드 불가(HTTP/1.0 fallback)”로 간주되어 연결 실패.
        
        **->Ingress Controller가 긴 연결을 허용하지 않거나, HTTP/1.1 핸드셰이크를 차단하고 있었음.**
        
**2️⃣ 해결 과정** <br>
  - Nginx Ingress annotation 추가

    `Ingress` 매니페스트에 아래 설정을 추가함

    ```yaml
        metadata:
          annotations:
            # 🔐 인증서 발급자 (cert-manager용)
            cert-manager.io/cluster-issuer: selfsigned-cluster-issuer
        
            # ⚡ SSE 안정화: 연결 지속 시간 연장
            nginx.ingress.kubernetes.io/proxy-read-timeout: "3600"
            nginx.ingress.kubernetes.io/proxy-send-timeout: "3600"
            nginx.ingress.kubernetes.io/proxy-buffering: "off"
        
            # 🔸 WebSocket: HTTP/1.1 업그레이드 허용
            nginx.ingress.kubernetes.io/proxy-http-version: "1.1"
            nginx.ingress.kubernetes.io/enable-websocket: "true"
        
            # 🍪 세션 스티키 (WebSocket 재연결 시 동일 노드 유지)
            nginx.ingress.kubernetes.io/affinity: "cookie"
            nginx.ingress.kubernetes.io/session-cookie-name: "INGRESS_STICKY"
            nginx.ingress.kubernetes.io/session-cookie-max-age: "86400"

    ```
        
**3️⃣ 결과**<br>
- 문제의 근본 원인은 **Ingress Controller의 기본 connection timeout 정책**이 SSE/WebSocket 특성(장시간 스트림)과 충돌했기 때문.<br>
- 특히 **Spring Boot + SSE + Nginx Ingress** 조합에서는 `proxy-buffering: off` 설정이 없으면 데이터가 즉시 클라이언트에 전달되지 않아 “끊긴 것처럼” 보일 수 있음.<br>
- HTTPS(SSL) 적용도 `cert-manager` issuer 설정이 없으면 WSS 연결이 거부되므로 필수.<br>
        
**🧩 개선 방향**<br>
  - 장기적으로는 **WebSocket 전용 Gateway (e.g., Nginx Stream, Traefik, Istio)** 도입 고려<br>
  - 클러스터에 따라 timeout을 ConfigMap 전역 설정(`nginx.conf`)으로 통합 관리 가능<br>






