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
