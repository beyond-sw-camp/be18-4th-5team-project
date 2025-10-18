pipeline {
    agent {
            kubernetes {
                yaml """
                apiVersion: v1
                kind: Pod
                metadata: 
                    labels:
                        run: jenkins-agent
                spec:
                    containers:
                    - name: docker
                    image: docker:28.5.1-cli-alpine
                    command:['cat']
                    tty: true
                    volumeMounts:
                    - name: docker-socket
                        mountPath: "/var/run/docker.sock"
                    volumes:
                    - name: docker-socket
                        hostPath:
                        path: "/var/run/docker.sock"
                """
        }
    }


    environment {
        DISCORD_WEBHOOK_CREDENTIALS_ID = 'discord-webhook'
        DOCKER_CREDENTIALS_ID = 'dockerhub-access'
        BACK_IMAGE_NAME = "sangwon0410/nongchukya-frontend"
        FRONT_IMAGE_NAME = "sangwon0410/nongchukya-backend"
        TAG = "${env.BUILD_NUMBER}"
    }    

    stages{
        stage('Checkout') {
            steps { checkout scm }
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

        stage('Backend Image Build & Push') {
            when {
                expression {
                    return env.SHOULD_BUILD_APP == "true"
                }
            }

            steps {
                container('docker') {
                    dir('nongchukya-backend') {
                        script {
                            def buildNumber = "${env.BUILD_NUMBER}"

                            withEnv(["DOCKER_IMAGE_VERSION=${buildNumber}"]) {
                                sh 'docker -v'
                                sh 'echo $BACK_IMAGE_NAME:$DOCKER_IMAGE_VERSION'
                                sh 'docker build --no-cache -t $BACK_IMAGE_NAME:$DOCKER_IMAGE_VERSION ./'
                                sh 'docker image inspect $APP_IMAGE_NAME:$DOCKER_IMAGE_VERSION'
                                sh 'docker push $BACK_IMAGE_NAME:$DOCKER_IMAGE_VERSION'
                            }
                        }
                    }
                }
            }
        }

        stage('Frontend Image Build & Push') {
            when {
                expression {
                    return env.SHOULD_BUILD_API == "true"
                }
            }

            steps {
                container('docker') {
                    dir('nongchukya-frontend') {
                        script {
                            def buildNumber = "${env.BUILD_NUMBER}"

                            withEnv(["DOCKER_IMAGE_VERSION=${buildNumber}"]) {
                                sh 'docker -v'
                                sh 'echo $FRONT_IMAGE_NAME:$DOCKER_IMAGE_VERSION'
                                sh 'docker build --no-cache -t $FRONT_IMAGE_NAME:$DOCKER_IMAGE_VERSION ./'
                                sh 'docker image inspect $FRONT_IMAGE_NAME:$DOCKER_IMAGE_VERSION'
                                sh 'docker push $FRONT_IMAGE_NAME:$DOCKER_IMAGE_VERSION'
                            }
                        }
                    }
                }
            }
        }


        stage('Docker Compose up') {
            steps {
                container('docker'){
                    sh '''
                    docker --version
                    docker compose version || true
                    docker compose up -d --build
                '''
                }
            }
        }


    }
        
    


    post {
        always{
            withCredentials([string(
                credentialsId: DISCORD_WEBHOOK_CREDENTIALS_ID,
                variable: 'DISCORD_WEBHOOK_URL'
            )]) {
                discordSend description: """
                제목 : ${env.JOB_NAME}:${currentBuild.displayName} 빌드
                결과 : ${currentBuild.result}
                실행 시간 : ${currentBuild.duration / 1000}s
                """,
                result: currentBuild.currentResult,
                title: "${env.JOB_NAME}", 
                webhookURL: "${DISCORD_WEBHOOK_URL}"
            }            
        }
    }
}
