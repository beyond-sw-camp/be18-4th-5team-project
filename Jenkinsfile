pipeline {
  agent {
    kubernetes {
      defaultContainer 'docker'
      yaml """
apiVersion: v1
kind: Pod
metadata:
  labels:
    run: jenkins-agent
spec:
  serviceAccountName: jenkins
  containers:
  - name: docker
    image: docker:28.5.1-cli-alpine3.22
    command: ['cat']
    tty: true
    volumeMounts:
    - name: docker-sock
      mountPath: /var/run/docker.sock
  volumes:
  - name: docker-sock
    hostPath:
      path: /var/run/docker.sock
"""
    }
  }

  environment {
    DISCORD_WEBHOOK_CREDENTIALS_ID = 'discord-webhook'
    DOCKER_CREDENTIALS_ID = 'dockerhub-access'
    BACK_IMAGE_NAME = "sangwon0410/nongchukya-backend"
    FRONT_IMAGE_NAME = "sangwon0410/nongchukya-frontend"
    //TAG = "${env.BUILD_NUMBER}"
    TAG = "latest"
  }

  stages {
    stage('Checkout') {
      steps {
        container('jnlp') {
          checkout scm
          sh 'echo "Git Checkout 완료"'
        }
      }
    }

    stage('Detect Changes') {
      steps {
        container('jnlp') {
          dir("${env.WORKSPACE}") {
            script {
              def inRepo = sh(script: 'git -C . rev-parse --is-inside-work-tree >/dev/null 2>&1 && echo yes || echo no', returnStdout: true).trim() == 'yes'
              if (!inRepo) {
                echo "Detect Changes: not a git worktree → 둘 다 빌드"
                env.SHOULD_BUILD_APP = "true"
                env.SHOULD_BUILD_API = "true"
                return
              }

              // HEAD~1 유무에 따른 폴백
              def hasPrev = sh(script: 'git -C . rev-parse --verify HEAD~1 >/dev/null 2>&1 && echo yes || echo no', returnStdout: true).trim() == 'yes'
              def diffCmd = hasPrev ? 'git -C . diff --name-only HEAD~1' : 'git -C . show --name-only --pretty="" HEAD'

              def changed = sh(script: diffCmd, returnStdout: true).trim()
              def files = changed ? changed.split("\\r?\\n") : []
              echo "Changed files:\n${files.join('\n')}"

              env.SHOULD_BUILD_APP = files.any { it.startsWith('backend/') }  ? "true" : "false"
              env.SHOULD_BUILD_API = files.any { it.startsWith('frontend/') } ? "true" : "false"

              // 첫 실행 등으로 비어있으면 둘 다 빌드
              if (!files) {
                env.SHOULD_BUILD_APP = "true"
                env.SHOULD_BUILD_API = "true"
              }

              echo "SHOULD_BUILD_APP=${env.SHOULD_BUILD_APP}, SHOULD_BUILD_API=${env.SHOULD_BUILD_API}"
            }
          }
        }
      }
    }

    stage('Docker Login') {
      steps {
        container('docker') {
          sh 'docker logout || true'
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

    stage('Backend Image Build & Push') {
      when {
        expression { return env.SHOULD_BUILD_APP == "true" || env.SHOULD_BUILD_APP == null }
      }
      steps {
        container('docker') {
          dir('backend') {
            script {
              def buildNumber = "${env.BUILD_NUMBER}"
              withEnv(["DOCKER_IMAGE_VERSION=${buildNumber}"]) {
                sh '''
                  set -eux
                  docker -v
                  echo "백엔드 이미지 빌드 시작: $BACK_IMAGE_NAME:$DOCKER_IMAGE_VERSION"
                  docker build --no-cache -t $BACK_IMAGE_NAME:$DOCKER_IMAGE_VERSION .
                  docker image inspect $BACK_IMAGE_NAME:$DOCKER_IMAGE_VERSION
                  docker push $BACK_IMAGE_NAME:$DOCKER_IMAGE_VERSION
                  # latest도 함께 푸시(현재 TAG=latest 사용 중)
                  docker tag $BACK_IMAGE_NAME:$DOCKER_IMAGE_VERSION $BACK_IMAGE_NAME:$TAG
                  docker push $BACK_IMAGE_NAME:$TAG
                '''
              }
            }
          }
        }
      }
    }

    stage('Frontend Image Build & Push') {
      when {
        expression { return env.SHOULD_BUILD_API == "true" || env.SHOULD_BUILD_API == null }
      }
      steps {
        container('docker') {
          dir('frontend') {
            script {
              def buildNumber = "${env.BUILD_NUMBER}"
              withEnv(["DOCKER_IMAGE_VERSION=${buildNumber}"]) {
                sh '''
                  set -eux
                  docker -v
                  echo "프론트엔드 이미지 빌드 시작: $FRONT_IMAGE_NAME:$DOCKER_IMAGE_VERSION"
                  docker build --no-cache -t $FRONT_IMAGE_NAME:$DOCKER_IMAGE_VERSION .
                  docker image inspect $FRONT_IMAGE_NAME:$DOCKER_IMAGE_VERSION
                  docker push $FRONT_IMAGE_NAME:$DOCKER_IMAGE_VERSION
                  # latest도 함께 푸시(현재 TAG=latest 사용 중)
                  docker tag $FRONT_IMAGE_NAME:$DOCKER_IMAGE_VERSION $FRONT_IMAGE_NAME:$TAG
                  docker push $FRONT_IMAGE_NAME:$TAG
                '''
              }
            }
          }
        }
      }
    }

    stage('Docker Compose up') {
      steps {
        container('docker') {
          script {
            def candidates = [
              'docker-compose.yml',
              'be18-4th-5team-project/docker-compose.yml'
            ]
            def composeFile = candidates.find { fileExists(it) }

            if (!composeFile) {
              sh """
                echo 'docker-compose 파일을 찾지 못했습니다.'
                echo 'WORKSPACE = ${WORKSPACE}'
                ls -la "${WORKSPACE}"
                echo '하위 2단계까지 탐색:'
                find "${WORKSPACE}" -maxdepth 2 -name 'docker-compose.*' -print || true
              """
              error('docker-compose 파일이 없습니다. 경로/이름을 확인하세요.')
            }

            withCredentials([
              string(credentialsId: 'DB_HOST', variable: 'DB_HOST'),
              string(credentialsId: 'DB_NAME', variable: 'DB_NAME'),
              string(credentialsId: 'DB_USER', variable: 'DB_USER'),
              string(credentialsId: 'DB_PASS', variable: 'DB_PASS'),
              string(credentialsId: 'MARIADB_ROOT_PASSWORD', variable: 'MARIADB_ROOT_PASSWORD'),
              string(credentialsId: 'REDIS_HOST', variable: 'REDIS_HOST'),
              string(credentialsId: 'REDIS_PORT', variable: 'REDIS_PORT'),
              string(credentialsId: 'REDIS_PASSWORD', variable: 'REDIS_PASSWORD'),
              string(credentialsId: 'APP_PROFILE', variable: 'APP_PROFILE'),
              string(credentialsId: 'EXTERNAL_PORT', variable: 'EXTERNAL_PORT')
            ]) {
              withEnv([
                "BACK_IMAGE_NAME=${env.BACK_IMAGE_NAME}",
                "FRONT_IMAGE_NAME=${env.FRONT_IMAGE_NAME}",
                "TAG=${env.TAG}"
              ]) {
                sh """
                set -eux
                echo "배포 태그(TAG) = ${TAG}"
                echo "발견된 compose 파일: ${composeFile}"

                # ⬇ 포트/컨테이너 충돌 제거
                docker compose -f "${composeFile}" -p "nongchukya" down --remove-orphans || true

                # ⬇ latest 쓸 때는 한 번 더 당겨서 신선도 보장
                docker compose -f "${composeFile}" pull || true

                docker compose -f "${composeFile}" -p "nongchukya" up -d --build
                docker compose -f "${composeFile}" -p "nongchukya" ps
                """
              }
            }
          }
        }
      }
    }
  }

  post {
    always {
      withCredentials([string(credentialsId: DISCORD_WEBHOOK_CREDENTIALS_ID, variable: 'DISCORD_WEBHOOK_URL')]) {
        discordSend(
          description: """
          제목 : ${env.JOB_NAME}:${currentBuild.displayName} 빌드
          결과 : ${currentBuild.result}
          실행 시간 : ${currentBuild.duration / 1000}s
          """,
          result: currentBuild.currentResult,
          title: "${env.JOB_NAME}",
          webhookURL: DISCORD_WEBHOOK_URL
        )
      }
    }
  }
}


