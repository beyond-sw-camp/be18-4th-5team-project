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
                    env.SHOULD_BUILD_APP = changedFiles.any { it.startsWith("nongchukya-back/") } ? "true" : "false"
                    env.SHOULD_BUILD_API = changedFiles.any { it.startsWith("nongchukya-front/") } ? "true" : "false"

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

        // stage('Docker Image Build & Push') {
        //     steps {
        //         container('docker') {
        //             script {
        //                 def buildNumber = "${env.BUILD_NUMBER}"

        //                 sh 'docker logout'
        //                 withCredentials([usernamePassword(
        //                     credentialsId: DOCKER_CREDENTIALS_ID,
        //                     usernameVariable: 'DOCKER_USERNAME',
        //                     passwordVariable: 'DOCKER_PASSWORD'
        //                 )]) {
        //                     sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
        //                 }

        //                 withEnv(["DOCKER_IMAGE_VERSION=${buildNumber}"]) {
        //                     sh 'docker -v'
        //                     sh 'echo $DOCKER_IMAGE_NAME:$DOCKER_IMAGE_VERSION'
        //                     sh 'docker build --no-cache -t $DOCKER_IMAGE_NAME:$DOCKER_IMAGE_VERSION ./'
        //                     sh 'docker image inspect $DOCKER_IMAGE_NAME:$DOCKER_IMAGE_VERSION'
        //                     sh 'docker push $DOCKER_IMAGE_NAME:$DOCKER_IMAGE_VERSION'
        //                 }
        //             }
        //         }
        //     }
        // }

        // stage('Trigger university-k8s-manifests') {
        //     steps {
        //         script {
        //             def buildNumber = "${env.BUILD_NUMBER}"

        //             withEnv(["DOCKER_IMAGE_VERSION=${buildNumber}"]) {
        //                 build job: 'university-k8s-manifests',
        //                     parameters: [
        //                         string(name: 'DOCKER_IMAGE_VERSION', value: "${DOCKER_IMAGE_VERSION}")
        //                     ], 
        //                     wait: true
        //                  }

                    
        //         }
        //     }
        // }
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
