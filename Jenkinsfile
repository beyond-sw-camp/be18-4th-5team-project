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
    TAG = "${env.BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        sh 'echo "Git Checkout 완료"'
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
        expression {
          return env.SHOULD_BUILD_APP == "true" || env.SHOULD_BUILD_APP == null
        }
      }
      steps {
        container('docker') {
          dir('backend') {
            script {
              def buildNumber = "${env.BUILD_NUMBER}"
              withEnv(["DOCKER_IMAGE_VERSION=${buildNumber}"]) {
                sh '''
                  docker -v
                  echo "백엔드 이미지 빌드 시작: $BACK_IMAGE_NAME:$DOCKER_IMAGE_VERSION"
                  docker build --no-cache -t $BACK_IMAGE_NAME:$DOCKER_IMAGE_VERSION .
                  docker image inspect $BACK_IMAGE_NAME:$DOCKER_IMAGE_VERSION
                  docker push $BACK_IMAGE_NAME:$DOCKER_IMAGE_VERSION
                '''
              }
            }
          }
        }
      }
    }

    stage('Frontend Image Build & Push') {
      when {
        expression {
          return env.SHOULD_BUILD_API == "true" || env.SHOULD_BUILD_API == null
        }
      }
      steps {
        container('docker') {
          dir('frontend') {
            script {
              def buildNumber = "${env.BUILD_NUMBER}"
              withEnv(["DOCKER_IMAGE_VERSION=${buildNumber}"]) {
                sh '''
                  docker -v
                  echo "프론트엔드 이미지 빌드 시작: $FRONT_IMAGE_NAME:$DOCKER_IMAGE_VERSION"
                  docker build --no-cache -t $FRONT_IMAGE_NAME:$DOCKER_IMAGE_VERSION .
                  docker image inspect $FRONT_IMAGE_NAME:$DOCKER_IMAGE_VERSION
                  docker push $FRONT_IMAGE_NAME:$DOCKER_IMAGE_VERSION
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
            dir('be18-4th-5team-project') {  //일단 강제 경로 지정
                sh '''
                echo "현재 디렉토리: $(pwd)"
                ls -la
                echo "Docker Compose 실행 시작"
                docker compose -f docker-compose.yaml up -d --build
                '''
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
